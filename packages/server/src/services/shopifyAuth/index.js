const express = require('express');
const createShopifyAuthRoutes = require('./shopifyAuth');

module.exports = function createRouter(shopifyConfig) {
    const router = express.Router();
    const { auth, callback } = createShopifyAuthRoutes(shopifyConfig);

    router.use('/auth/callback', callback);
    router.use('/auth', auth);
    return router;
};
