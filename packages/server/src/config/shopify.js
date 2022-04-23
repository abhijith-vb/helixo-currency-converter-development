// import .env variables
// const dotenv = require('dotenv').config();
// const shopifyExpress = require('shopify-express');
// const { MemoryStrategy } = require('shopify-express/strategies');
const uuidv4 = require('uuid/v4');
const shopifyAuth = require('../services/shopifyAuth');
const updateAccessToken = require('../utils/development/updateAccessToken');

const { host, env, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES } = require(`./env`);
const { doTasksAfterShopifyAuth } = require('../utils/shopifyAfterAuth');

const isDevelopment = env === 'development';

const router = shopifyAuth({
    host,
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET,
    scopes: SCOPES,
    async afterAuth(req, res) {
        const {
            session: { accessToken, shop }
        } = req;
        /**
         * MIX SESSION ID AND TOKEN
         * This is a hack to work on safari
         * Problem: Safari won't send third-party cookies so session will fail to validate
         * Solution: Mix the actual token with the session id and send the token on every request
         *  - On every request, extract the session id from the token and validate
         * */
        const uuid = uuidv4();
        const SESSION_ID_TOKEN_SALT_MIX = `${req.sessionID}.${uuid}`;
        req.session.bucksccToken = SESSION_ID_TOKEN_SALT_MIX;

        // update the accessToken for development
        if (isDevelopment) updateAccessToken(accessToken);
        // Reset current session
        delete req.session.currentThemeId;
        console.log(`session`, req.session);
        // install webhooks or hook into your own app here
        doTasksAfterShopifyAuth(req, res);
    }
});

module.exports = router;
