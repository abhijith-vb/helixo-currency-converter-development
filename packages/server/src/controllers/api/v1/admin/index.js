const express = require('express');
const adminController = require('./admin.controller');
const devController = require('./dev.controller');

const admin = express.Router();

admin.get('/merchants', adminController.getMerchantsList);
admin.get('/access', devController.setDevModeSesssion);

module.exports = admin;
