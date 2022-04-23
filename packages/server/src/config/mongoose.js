const mongoose = require('mongoose');

const config = require(`./env`);
const { mongo, env } = config;
// Exit application on error
mongoose.connection.on('error', err => {
    console.log(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

if (env === 'development') mongoose.set('debug', true);

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
// mongoose.Promise = Promise;
exports.connect = () => {
    try {
        mongoose
            .connect(mongo.uri, {
                useCreateIndex: true,
                keepAlive: 1,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            .then(docs => {
                console.log(`========= DB Connected ========`);
            })
            .catch(err => {
                console.log(`err`, err);
            });
        return mongoose.connection;
    } catch (err) {
        console.log(`#### Error Connecting DB`, err);
        console.log(`Mongo URI: `, mongo.uri);
    }
};
