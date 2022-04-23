const path = require('path');
const dotenv = require('dotenv').config();

// Express app and config
const app = require('./config/express');
const config = require('./config/env');

const { port, env } = config;

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
