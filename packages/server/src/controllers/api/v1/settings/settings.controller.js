/* eslint-disable prettier/prettier */
const status = require('http-status');
const Shopify = require('shopify-api-node');

const AppSettings = require('../../../../models/settings.model');
const APIError = require('../../../../utils/APIError');
const { env } = require('../../../../config/env');
const updateConfigurationInThemeSnippet = require('../../../../utils/widgets/updateConfigurationInThemeSnippet');
const instantLoaderScript = require('./instantLoaderScript');
const injectScriptTag = require('../../../../utils/shopifyAfterAuth/injectScriptTag');

const isDevelopment = env === 'development';

/**
 * Get details of app from DB
 */
const getAppDetails = async (req, res, next) => {
    const { shop } = req.session;
    AppSettings.findOne({ shop }, '-_id -shop')
        .lean()
        .then(settings => {
            res.status(status.OK).json(settings || {});
        })
        .catch(err => console.log(`Error From getting apps`, err));
};

const updateAppStatus = async (req, res) => {
    try {
        const { active } = req.body;
        const { shop, domain, currentThemeId } = req.session;
        /**
         * Update the settings in shopify snippet too, invoking this will fasten the DB save and response times of User Interation
         * and update to shopify snippet in background
         * */
        // new:true in findOneAndUpdate will return the updated value
        const appSettings = await AppSettings.findOneAndUpdate({ shop }, { $set: { active } }, { new: true }).lean();

        if (!currentThemeId) await updateConfigurationInThemeSnippet(domain, null, appSettings, req);
        else updateConfigurationInThemeSnippet(domain, null, appSettings, req);
        res.json({ status: 'success', message: 'App Status Updated!' });
    } catch (err) {
        res.status(status.BAD_REQUEST).json({
            status: 'error',
            message: 'Unable to update status'
        });
    }
};

/**
 * update app details
 */
const updateAppDetails = async (req, res, next) => {
    try {
        const data = req.body;
        const { shop, domain, currentThemeId } = req.session;
        const additionalScripts = '';
        const appSettingsUpdate = await AppSettings.findOneAndUpdate({ shop }, { $set: data }, { upsert: true });

        // If appSettingsUpdate is null then there is not settings entry in DB, so it's a new user
        /**
         * For first time users appSettingsUpdate is null, so return true, this will remove script tags
         * For Other users appSettingsUpdate has value, data.instantLoader is true then remove script tags
         */
        // const needToRemoveScriptTag = !(appSettingsUpdate) || data.instantLoader;


        /**
         * Update the settings in shopify snippet too, invoking this will fasten the DB save and response times of User Interation
         * and update to shopify snippet in background
         * */
        if (!currentThemeId) await updateConfigurationInThemeSnippet(domain, null, data, req, additionalScripts);
        else updateConfigurationInThemeSnippet(domain, null, data, req, additionalScripts);

        res.json({ status: 'success', message: 'Settings Saved!' });
    } catch (err) {
        console.log(`err on saving`, err);
        res.status(status.BAD_REQUEST).json({
            status: 'error',
            message: 'Unable to save app settings'
        });
    }
};

const handleInstantLoader = async (req, res) => {
    const { active } = req.body;
    try {
        const { shop, domain, accessToken } = req.session;
        const shopify = new Shopify({ shopName: shop, accessToken });
        // new:true will return the updated document
        const appSettings = await AppSettings.findOneAndUpdate({ shop }, { $set: { instantLoader: active } }, { new: true }).lean();

        // Instant loader deactivated
        if (!active) {
            // REMOVE EXISTING INJECTED SCRIPT FROM THEME AND ADD SCRIPT TAG
            /**
             * 1. Add script tag and put script id in DB
             * 2. Remove existing theme script
             */

            // Injected sdk via script tag
            // injectScriptTag(shopify, shop);
            console.log(`Added ScriptTag`);

            // Update default config to theme
            await updateConfigurationInThemeSnippet(domain, null, appSettings, req);
            console.log(`Injected default config to theme`);
            res.json({
                status: 'success',
                message: 'Instant Loader Deactivated!'
            });
        } else {
            // REMOVE SDK SCRIPT FROM SCRIPT TAG AND INJECT TO THEME

            // Inject the additional scripts to theme
            await updateConfigurationInThemeSnippet(
                domain,
                shopify,
                appSettings,
                req,
                null,
                null
            );
            console.log(`Injected Instant Loader Script`);
            res.json({
                status: 'success',
                message: 'Instant Loader Activated!'
            });
        }
    } catch (err) {
        const error = (err && err.response && err.response.body && err.response.body.errors) || err;
        console.log(`Error from removing scripttag`, error);
        res.status(status.UNPROCESSABLE_ENTITY).send();
    }
};

module.exports = { getAppDetails, updateAppDetails, updateAppStatus, handleInstantLoader };
