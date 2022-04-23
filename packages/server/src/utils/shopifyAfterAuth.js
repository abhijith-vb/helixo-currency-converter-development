/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable import/no-dynamic-require */
// import .env variables
const dotenv = require('dotenv').config();
const Shopify = require('shopify-api-node');
const isEmpty = require('lodash/isEmpty');
const User = require('../models/user.model');
const AppSettings = require('../models/settings.model');
const { injectThemeSnippets } = require('./codeInjector.util');

const saveUserDetailsToDB = require('./user/saveUserDetailsToDB');
const injectScriptTags = require('./shopifyAfterAuth/injectScriptTag');

const { host, env, SHOPIFY_API_KEY } = require(`../config/env`);

/*
 * Inject necessary Scripts and register webhooks
 */
async function injectScripts(hostUrl, shop, shopify, user, appSettings) {
    // const shop_name = helper.cleanDomain(shop);
    // const encrypted_shop_name = shop_name;
    /*
     * Inject sdk script to shopify
     */
    injectScriptTags(shopify, shop, user);
    /*
     * Register uninstall webhook
     */
    shopify.webhook
        .create({
            address: `${host}/api/v1/hooks/app/uninstalled`,
            topic: 'app/uninstalled',
            format: 'json'
        })
        .then(docs => {
            console.log(`registered app uninstalled hook : `, docs);
        })
        .catch(err => {
            console.log(err.response.body.errors);
        });
    /*
     * Register theme publish webhook
     */
    shopify.webhook
        .create({
            address: `${host}/api/v1/hooks/shop/update`,
            topic: 'shop/update',
            format: 'json'
        })
        .then(docs => {
            console.log(`registered shop update hook : `, docs);
        })
        .catch(err => {
            console.log(err.response.body.errors);
        });
    /*
     * Register theme publish webhook
     */
    shopify.webhook
        .create({
            address: `${host}/api/v1/hooks/themes/publish`,
            topic: 'themes/publish',
            format: 'json'
        })
        .then(docs => {
            console.log(`registered theme publish hook : `, docs);
        })
        .catch(err => {
            console.log(err.response.body.errors);
        });
    injectThemeSnippets(shopify, shop, null, user, appSettings);
    return true;
}

// Tasks to do in background after shopify auth
async function doTasksAfterShopifyAuth(req, res) {
    // Getting useful vars from session
    const { accessToken, shop, bucksccToken } = req.session;
    // const { REDIRECT_TO_STORE_AFTER_AUTH } = process.env;
    // Create shopify API instance
    const shopify = new Shopify({
        shopName: shop,
        accessToken
    });
    // Getting user details from shopify
    const user =
        (await User.findOne(
            { myshopify_domain: shop },
            'is_active myshopify_domain _id currency domain primary_locale'
        ).lean()) || {};
    const appSettings = await AppSettings.findOne({ shop }).lean();

    // Getting status of user
    const { is_active, _id, currency, primary_locale } = user || {};
    const isNewUser = !is_active;

    console.log(`isNewUser`, isNewUser);

    // Update user details to DB
    let newShopData;
    const updateUserDetails = async () => {
        newShopData = await shopify.shop.get().catch(err => console.log(`Error from fetching user data`, err));
        newShopData = !isEmpty(user) ? { ...user, ...newShopData } : { ...newShopData };
        newShopData = { ...newShopData, ...{ accessToken, is_active: true } };
        // Save updated details to db
        console.log(`saving details to db`);
        saveUserDetailsToDB(newShopData);
    };

    user.isNewUser = isNewUser;
    // Log user install event
    const logData = {
        userId: user._id,
        shop,
        event: null,
        value: 'true'
    };

    logData.event = user.isNewUser ? 'install' : 'access';
    // Default redirect url
    const redirectUrl = `${host}/?token=${bucksccToken}&shop=${shop}&key=${SHOPIFY_API_KEY}&isNewUser=${isNewUser}&locale=${primary_locale}`;

    // Update user details to db
    await updateUserDetails();

    // Set domain to session
    req.session.domain = user.domain || newShopData.domain;

    if (isNewUser) {
        // Add default settings to  DB
        const defaultSettings = {
            shop,
            userId: _id,
            active: false,
            userCurrency: currency,
            selectedCurrencies: "['USD']",
            autoSwitchCurrencyLocationBased: false,
            showCurrencySymbol: false,
            displayPosition: 'left_bottom',
            showInDesktop: true,
            showInMobileDevice: true,
            showOriginalPriceOnMouseHover: false,
            cartNotificationStatus: false,
            cartNotificationMessage: null,
            roundPriceStatus: false,
            roundingDecimal: 0,
            integreteWithOtherApps: true,
            themeType: 'theme1',
            backgroundColor: '#fff',
            textColor: '#333',
            hoverColor: '#ccc'
        };
    }

    res.redirect(redirectUrl);

    // Do async script injections for new user
    if (isNewUser) {
        injectScripts(host, shop, shopify, newShopData, appSettings);
    }
}

module.exports = { doTasksAfterShopifyAuth };
