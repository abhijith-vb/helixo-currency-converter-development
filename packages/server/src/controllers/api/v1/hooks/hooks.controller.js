/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const User = require('../../../../models/user.model');
const AppSettings = require('../../../../models/settings.model');
const { sendUninstallTransactionalMail } = require('../../../../utils/mailEngine');
const { injectThemeSnippets } = require('../../../../utils/codeInjector.util');
const saveUserDetailsToDB = require('../../../../utils/user/saveUserDetailsToDB');
/**
 * FIRST THING TO DO IS TO RESPOND TO HOOKS IMMEDIATLY THEN DO THE ACTIONS
 */

exports.showHooks = (req, res) => {
    console.log(req);
};

exports.saveUserDetails = async (req, res) => {
    const data = req.body;
    saveUserDetailsToDB(data);
    res.sendStatus(200);
};

exports.customersRedact = async (req, res) => {
    // customers/redact
    res.status(200).json({
        status: 'success',
        message: "Customer's Redact Initiated"
    });
};

exports.shopRedact = async (req, res) => {
    // customers/redact
    res.status(200).json({
        status: 'success',
        message: 'Shop Redact Initiated'
    });
};

exports.customersDataRequest = async (req, res) => {
    // customers/redact
    res.status(200).json({
        status: 'success',
        message: "Customer's Data Redact Initiated"
    });
};

exports.changeTheme = async (req, res) => {
    res.status(200).send();
    try {
        const shop = req.get('x-shopify-shop-domain');
        const userDetails = await User.findOne({ myshopify_domain: shop });
        const appSettings = await AppSettings.findOne({ shop });
        console.log('change theme hook invoked');

        /**
         * 1. Get all the user details and app settings
         * 2. If instant loader is activated then get the instant loader script
         * 3. Inject the script to theme
         */

        injectThemeSnippets(null, shop, true, userDetails, appSettings);
    } catch (err) {
        console.log(`Error from theme change hook`, err);
    }
};

exports.appsUninstalled = async (req, res) => {
    res.status(200).send();
    try {
        const shop = req.get('x-shopify-shop-domain');
        const RESET_USER = {
            is_active: false,
            scriptTagId: null,
            last_uninstall: Date.now(),
            onboardingProgress: { step: 0 }
        };
        const RESET_SETTINGS = {
            active: false,
            instantLoader: false
        };
        console.log('uninstall hook');
        User.findOneAndUpdate(
            { myshopify_domain: shop },
            {
                $set: RESET_USER,
                $inc: { uninstalls: 1 }
            },
            (err, docs) => {
                if (!(docs || {}).uninstalls || (docs || {}).uninstalls === 0) sendUninstallTransactionalMail(docs);
                AppSettings.updateOne(
                    { shop },
                    {
                        $set: RESET_SETTINGS
                    },
                    (err, docs) => { }
                );
            }
        );
    } catch (err) {
        console.log('Error from uninstall hook', err);
    }
};
