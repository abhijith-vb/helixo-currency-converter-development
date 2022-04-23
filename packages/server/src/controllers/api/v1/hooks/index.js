/**
 * Hooks Route
 */
const express = require('express');

const hooks = express.Router();

const hooksController = require('./hooks.controller');

hooks.post('/shop/update', hooksController.saveUserDetails);
hooks.post('/app/uninstalled', hooksController.appsUninstalled);
hooks.post('/themes/publish', hooksController.changeTheme);
hooks.post('/customers/redact', hooksController.customersRedact);
hooks.post('/shop/redact', hooksController.shopRedact);
hooks.post('/customers/data_request', hooksController.customersDataRequest);

module.exports = hooks;
