/**
 * Version 1 API Routes
 */

const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./user');
const settingsRoutes = require('./settings');
const hooksRoutes = require('./hooks');
const publicRoutes = require('./public');

const userAuth = require('../../../middlewares/userAuth');
const hooksValidate = require('../../../middlewares/verifyHooks');
const parseDataAsBuffer = require('./hooks/parseDataAsBuffer');

const v1 = express.Router();

/**
 * GET v1/status
 */
v1.get('/status', (req, res) => res.send('OK'));

/**
 * Private Routes
 */

v1.use('/user', userAuth, userRoutes);
v1.use('/hooks', hooksRoutes);
v1.use('/settings', userAuth, settingsRoutes); // TODO: Add userAuth in production

/* Super Admin Routes */
// No need of adminAuth, adminAuth needs x-ufe-auth header
// v1.use('/api/dev', devRoutes);
// v1.use('/api/v1/admin', adminAuth, adminRoutes);

/**
 *  Public Routes
 */
v1.use('/public', publicRoutes);

module.exports = v1;
