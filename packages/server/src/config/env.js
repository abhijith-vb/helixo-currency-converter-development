// import .env variables
// const dotenv = require('dotenv').config();
const { ENVIRONMENT } = process.env;
const accessToken = require('./accessToken');

// Config for different
const config = {
    DEVELOPMENT: {
        port: process.env.PORT,
        env: process.env.ENVIRONMENT,
        host: process.env.TUNNEL_URL,
        mongo: {
            uri: process.env.MONGO_ENV === 'remote' ? process.env.MONGO_REMOTE : process.env.MONGO_URI
        },
        DISCORD_BOT_HOST: 'http://localhost:3002',
        SENTRY_DSN: process.env.SENTRY_DSN,
        SHOPIFY_CLI_DEV: process.env.SHOPIFY_CLI_DEV,
        SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
        SCOPES: process.env.SCOPES,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
        MAIL: {
            CEO_MAIL: process.env.CEO_MAIL,
            CEO_NAME: process.env.CEO_NAME,
            SUPPORT_MAIL: process.env.SUPPORT_MAIL,
            SUPPORT_AGENT_NAME: process.env.SUPPORT_AGENT_NAME,
            TEMPLATES: {
                // Template IDs must be an integrer
                UNINSTALL_TEMPLATE_ID: process.env.UNINSTALL_TEMPLATE_ID
            }
        },
        FAKE_SESSION: {
            shop: process.env.SHOP,
            domain: process.env.SHOP,
            bucksccToken: '1',
            accessToken
        }
    },
    PRODUCTION: {
        port: process.env.PORT,
        env: process.env.ENVIRONMENT,
        host: process.env.PRODUCTION_HOST,
        SENTRY_DSN: process.env.SENTRY_DSN,
        mongo: { uri: process.env.MONGO_REMOTE },
        DISCORD_BOT_HOST: 'http://localhost:3002',
        SHOPIFY_CLI_DEV: process.env.SHOPIFY_CLI_DEV,
        SHOPIFY_API_KEY: process.env.PRODUCTION__SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET: process.env.PRODUCTION__SHOPIFY_API_SECRET,
        SCOPES: process.env.SCOPES,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
        MAIL: {
            CEO_MAIL: process.env.CEO_MAIL,
            CEO_NAME: process.env.CEO_NAME,
            SUPPORT_MAIL: process.env.SUPPORT_MAIL,
            SUPPORT_AGENT_NAME: process.env.SUPPORT_AGENT_NAME,
            TEMPLATES: {
                // Template IDs must be an integrer
                UNINSTALL_TEMPLATE_ID: process.env.UNINSTALL_TEMPLATE_ID
            }
        },
        ADMIN_STORES: ['ufe-demo.myshopify.com', 'ufe-admin.myshopify.com', 'ufe-testing-client.myshopify.com']
    },
    STAGING: {
        port: process.env.PORT,
        env: process.env.ENVIRONMENT,
        host: process.env.PRODUCTION_HOST,
        SENTRY_DSN: process.env.SENTRY_DSN,
        mongo: {
            uri: process.env.MONGO_ENV === 'remote' ? process.env.MONGO_REMOTE : process.env.MONGO_URI
        },
        DISCORD_BOT_HOST: 'http://localhost:3002',
        SHOPIFY_CLI_DEV: process.env.SHOPIFY_CLI_DEV,
        SHOPIFY_API_KEY: process.env.PRODUCTION__SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET: process.env.PRODUCTION__SHOPIFY_API_SECRET,
        SCOPES: process.env.SCOPES,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
        MAIL: {
            CEO_MAIL: process.env.CEO_MAIL,
            CEO_NAME: process.env.CEO_NAME,
            SUPPORT_MAIL: process.env.SUPPORT_MAIL,
            SUPPORT_AGENT_NAME: process.env.SUPPORT_AGENT_NAME,
            TEMPLATES: {
                // Template IDs must be an integrer
                UNINSTALL_TEMPLATE_ID: process.env.UNINSTALL_TEMPLATE_ID
            }
        },
        ADMIN_STORES: ['ufe-demo.myshopify.com', 'ufe-admin.myshopify.com', 'ufe-testing-client.myshopify.com'],
        FAKE_SESSION: {
            shop: 'buckscc-demo.myshopify.com',
            accessToken: '',
            bucksccToken: '1'
        }
    }
};

// Export config based on the env
module.exports = config[ENVIRONMENT.toUpperCase()] || {};
