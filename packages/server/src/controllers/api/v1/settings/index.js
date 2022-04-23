const express = require('express');

const settings = express.Router();
const widgetsController = require('./settings.controller');

/**
 * Add / update app details
 */
settings.post('/', widgetsController.updateAppDetails);
settings.post('/instantLoader', widgetsController.handleInstantLoader);
settings.get('/', widgetsController.getAppDetails);

/**
 * Add / update app status
 */
settings.post('/setStatus', widgetsController.updateAppStatus);

module.exports = settings;
