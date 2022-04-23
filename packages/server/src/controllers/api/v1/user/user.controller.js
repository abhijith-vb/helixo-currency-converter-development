/* eslint-disable no-console */
const httpStatus = require('http-status');
const Shopify = require('shopify-api-node');
const User = require('../../../../models/user.model');
const saveUserDetailsToDB = require('../../../../utils/user/saveUserDetailsToDB');

const onboardingStatusUpdate = async (req, res) => {
    try {
        const { step, feedbackRating = null, feedbackGiven = null } = req.body;
        const { shop } = req.session;
        const saveData = {};
        if (feedbackGiven !== null) saveData.feedbackGiven = feedbackGiven;
        if (feedbackRating !== null) saveData.feedbackRating = feedbackRating;
        if (feedbackGiven === false) saveData.lastFeedbackTime = new Date();
        if (step) saveData.onboardingProgress = { step };

        const updateDetails = await User.updateOne({ myshopify_domain: shop }, { $set: saveData });
        if (updateDetails)
            res.json({
                status: 'success',
                message: 'Feedback Submitted!'
            });
        // User.updateOne({ myshopify_domain: shop }, { $set: { onboardingProgress: { step } } })
        //     .then(docs => {
        //         res.json({
        //             status: 'success',
        //             message: 'Onboarding progress updated!'
        //         });
        //     })
        //     .catch(err => {
        //         res.status(httpStatus.NOT_FOUND).json({
        //             status: 'error',
        //             message: "Can't update status"
        //         });
        //     });
    } catch (err) {
        res.status(httpStatus.NOT_ACCEPTABLE).send();
        console.log(`Error from updating feedback`, err);
    }
};

const saveRestoreId = (req, res) => {
    const { restoreId } = req.body;
    if (!restoreId) return res.sendStatus(401);
    try {
        const data = {
            myshopify_domain: req.session.shop,
            restoreId
        };
        saveUserDetailsToDB(data);
        res.sendStatus(200);
    } catch (error) {
        console.log(`err saving restore id`, error);
        res.sendStatus(403);
    }
};

const updateAppStatus = async (req, res) => {
    const { active } = req.body;
    const { shop } = req.session;
    User.findOneAndUpdate({ myshopify_domain: shop }, { $set: { appEnabled: active } })
        .then(docs => {
            res.json({
                status: 'success',
                message: 'App Enabled!'
            });
        })
        .catch(err => {
            res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Unable to enable app'
            });
        });
};

const getUserDetails = (req, res) => {
    console.log('session', req.session);
    User.findOne(
        { myshopify_domain: req.session.shop },
        {
            _id: 0,
            name: 1,
            is_active: 1,
            money_format: 1,
            currency: 1,
            myshopify_domain: 1,
            customer_email: 1,
            email: 1,
            phone: 1,
            domain: 1,
            ufe_plan: 1,
            plan_name: 1,
            plan_display_name: 1,
            shop_owner: 1,
            password_enabled: 1,
            eligible_for_payments: 1,
            enabled_presentment_currencies: 1,
            created_at: 1,
            restoreId: 1,
            settings: 1,
            funnelsImported: 1,
            money_with_currency_format: 1,
            primary_locale: 1,
            onboardingProgress: 1,
            feedbackRating: 1,
            feedbackGiven: 1,
            lastFeedbackTime: 1,
            ufeClicked: 1,
            alphaClicked: 1,
            showedCheckoutConversion: 1,
            crispChat:1
        }
    )
        .lean()
        .exec()
        .then(docs => {
            if (!(docs || {}).is_active)
                return res.status(httpStatus.NOT_FOUND).json({
                    status: 'error',
                    message: 'User is not active'
                });
            const newDocs = { ...docs };
            newDocs.currencySymbol = docs.money_format;
            // newDocs.currencySymbol = docs.money_format.replace('{{amount}}', '');
            // Default set it to free, for users don't have a ufe_plan entry in db
            newDocs.ufe_plan = newDocs.ufe_plan || 'free';
            // TODO: Fix this issue, after auth it shows lo login page again
            // if (newDocs.is_active)
            const { dev, devShop, devToken } = req.session;
            if (dev && devShop && devToken) newDocs.isDev = true;
            res.status(httpStatus.OK).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(httpStatus.NOT_FOUND).send({ status: 'error', message: 'User not found!' });
        });
};

/**
 * Function to get user details directly from the shopify
 * @param {Express Object} req
 * @param {Express Object} res
 */
const getUserDetailsFromShopify = async (req, res) => {
    try {
        const { shop: shopName, accessToken } = req.session;
        console.log(`access`, accessToken);
        const shopify = new Shopify({
            shopName,
            accessToken
        });
        const userDetails = await shopify.shop.get();
        res.json(userDetails);
    } catch (err) {
        console.log(`Error from getting user data`, err);
        res.sendStatus(404);
    }
};

const logout = (req, res) => {
    res.clearCookie('__session');
    res.redirect('/');
};

const handleFeedback = async (req, res) => {
    try {
        const { feedbackRating = null, feedbackGiven = null } = req.body;
        const { shop } = req.session;
        const saveData = {};
        if (feedbackGiven !== null) saveData.feedbackGiven = feedbackGiven;
        if (feedbackRating !== null) saveData.feedbackRating = feedbackRating;
        if (feedbackGiven === false) saveData.lastFeedbackTime = new Date();
        const updateDetails = await User.updateOne({ myshopify_domain: shop }, { $set: saveData });
        if (updateDetails)
            res.json({
                status: 'success',
                message: 'Feedback Submitted!'
            });
    } catch (err) {
        res.status(httpStatus.NOT_ACCEPTABLE).send();
        console.log(`Error from updating feedback`, err);
    }
};

const adClickTrack = async (req, res) => {
    try {
        const { ufeClicked = null, alphaClicked = null } = req.body;
        const { shop } = req.session;
        const saveData = {};
        if (ufeClicked !== null) saveData.ufeClicked = ufeClicked;
        if (alphaClicked !== null) saveData.alphaClicked = alphaClicked;

        const updateDetails = await User.updateOne({ myshopify_domain: shop }, { $set: saveData });
        if (updateDetails)
            res.json({
                status: 'success',
                message: 'Logged!'
            });
    } catch (err) {
        res.status(httpStatus.NOT_ACCEPTABLE).send();
        console.log(`Error from updating feedback`, err);
    }
};
/**
 * save crisp token to db
 */
const updateCrispChatToken = async (req, res, next) => {
    try {
        const payload = req.body;
        const { shop } = req.session;
        const query = { myshopify_domain: shop };
        /**
         * Update user details
         */
        await User.findOneAndUpdate(query, { $set: { crispChat: payload } });
        res.json({
            status: 'success',
            message: 'Crisp token updated successfully!',
        });
    } catch (err) {
        console.log(`Error while updating crisp chat token`, err);
        next(err);
    }
};

const checkoutConversionTrack = async (req, res) => {
    try {
        const { showedCheckoutConversion = null } = req.body;
        const { shop } = req.session;
        const saveData = {};
        if (showedCheckoutConversion !== null) saveData.showedCheckoutConversion = showedCheckoutConversion;
        const updateDetails = await User.updateOne({ myshopify_domain: shop }, { $set: saveData });
        if (updateDetails)
            res.json({
                status: 'success',
                message: 'Logged!'
            });
    } catch (err) {
        res.status(httpStatus.NOT_ACCEPTABLE).send();
        console.log(`Error from updating feedback`, err);
    }
};

module.exports = {
    getUserDetails,
    updateAppStatus,
    saveRestoreId,
    onboardingStatusUpdate,
    getUserDetailsFromShopify,
    logout,
    handleFeedback,
    adClickTrack,
    checkoutConversionTrack,
    updateCrispChatToken
};
