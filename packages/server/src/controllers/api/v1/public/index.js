const express = require('express');

const publicRoutes = express.Router();
const widgetsController = require('./widgetsPublic.controller');

/**
 * Get single app details
 */
publicRoutes.get('/currency', widgetsController.getCurrencies);
publicRoutes.post('/config', widgetsController.getConfig);

module.exports = publicRoutes;
