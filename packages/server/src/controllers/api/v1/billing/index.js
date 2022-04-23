const express = require('express');

const billing = express.Router();
const billingController = require('./billing.controller');

billing.post('/', billingController.initiateBilling);

module.exports = billing;
