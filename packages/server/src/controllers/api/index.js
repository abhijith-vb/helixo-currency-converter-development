/**
 * API Version 1 Routes
 */
const express = require('express');

const api = express.Router();
const v1Routes = require('./v1');

/**
 *  Public Routes
 */
api.use('/v1', v1Routes);

module.exports = api;
