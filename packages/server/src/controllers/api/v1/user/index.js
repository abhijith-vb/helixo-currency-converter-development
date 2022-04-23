const express = require('express');

const user = express.Router();
const userController = require('./user.controller');

// user.get('/auth', shopifyAuth.shopify_auth_process);
// user.get('/auth/refreshtoken', userController.refreshToken);
user.get('/', userController.getUserDetails);
user.get('/latest', userController.getUserDetailsFromShopify);
user.post('/feedback', userController.handleFeedback);
user.post('/adClickTrack', userController.adClickTrack);
user.post('/onboarding', userController.onboardingStatusUpdate);
// user.post('/restoreId', userController.saveRestoreId);
user.use('/updateChatToken', userController.updateCrispChatToken);
user.post('/setStatus', userController.updateAppStatus);
user.get('/logout', userController.logout);
user.post('/checkoutConversion', userController.checkoutConversionTrack);
module.exports = user;
