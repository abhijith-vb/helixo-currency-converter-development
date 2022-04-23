const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const compress = require('compression');
const cors = require('cors');
const Sentry = require('@sentry/node');

// Routes
const MongoStore = require('connect-mongo')(session);
const api = require('../controllers/api');

// Middlewares
const error = require('../middlewares/error');
const safariSessionFaking = require('../middlewares/safariSessionFaking');

// Global config
const shopify = require('./shopify');

const config = require(`./env`);
const mongoose = require('./mongoose');

const { env, SHOPIFY_CLI_DEV, SENTRY_DSN } = config;
const IS_DEVELOPMENT = env === 'development';
const IS_SHOPIFY_CLI_DEV = SHOPIFY_CLI_DEV === 'true';

/**
 * Establish Mongoose connection
 */
const mongooseInstance = mongoose.connect();

/**
 * Express instance
 * @public
 */
const app = express();

app.set('trust proxy', 1);

if (!IS_DEVELOPMENT) {
    // Sentry init
    Sentry.init({ dsn: SENTRY_DSN });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
}

// print mongoose logs in dev env
app.use((req, res, next) => {
    // Assign user agent detect to req
    const userAgent = (req.headers || {})['user-agent'];
    const IS_FUCKING_SAFARI = /^((?!chrome|android).)*safari/i.test(userAgent);

    // Assign it to req
    req.IS_FUCKING_SAFARI = IS_FUCKING_SAFARI;

    // No need to set fake session for ngrok
    if (IS_DEVELOPMENT && !req.hostname.includes('ngrok')) {
        const { FAKE_SESSION } = config;
        console.log(`Faking Session..`);
        req.session = FAKE_SESSION;
    }
    if (!IS_DEVELOPMENT) {
        const shop = req.header('origin') || req.header('referer');
        Sentry.configureScope(function (scope) {
            scope.setUser({ username: shop });
            scope.setTag({ shop });
        });
        const transactionId = req.header('X-Transaction-ID');
        if (transactionId) {
            Sentry.configureScope(scope => {
                scope.setTag('transaction_id', transactionId);
            });
        }
    }
    // Add cors headers for api requests
    res.setHeader('Access-Control-Allow-Origin', '*');

    // IMPORTANT: Set CACHE-CONTROL to PRIVATE, otherwise CDN will CACHE it
    res.setHeader('Cache-Control', 'private');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, x-buckscc-auth, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// request logging. dev: console | production: file
app.use(morgan('short'));

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 1 Hr session expiry time
const SESSION_TIME = 1 * 60 * 60 * 1000;

// Session
app.use(
    session({
        secret: 'BucksCurrencyConverter_SE',
        name: '__session',
        store: new MongoStore({ mongooseConnection: mongooseInstance }),
        resave: false,
        saveUninitialized: false,
        maxAge: SESSION_TIME,
        cookie: {
            maxAge: SESSION_TIME,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
    })
);

// Get the session id from the X-BUCKSCC-AUTH and assign it to session
app.use(safariSessionFaking);

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
// app.use(helmet.frameguard({
//     action: 'allow-from',
//     domain: '*'
// }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

/**
 * Shopify Routes
 * For development with shopify-cli mount shopify routes to /
 * For production access shopify routes on /api
 */
if (IS_DEVELOPMENT && IS_SHOPIFY_CLI_DEV) app.use('/', shopify);
else app.use('/api', shopify);

// mount api v1 routes
// Some routes inside this route is private, so use middleware inside app
app.use('/api', api);
// Serve public static files from server

app.use(express.static(path.join(__dirname, '../../dist/')));

// app.use(express.static(path.join(__dirname, '../../dist/client')));

// Serve all other to react app
app.get('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../dist/', 'index.html'));
});

// The error handler must be before any other error middleware and after all controllers
if (!IS_DEVELOPMENT) app.use(Sentry.Handlers.errorHandler());

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
