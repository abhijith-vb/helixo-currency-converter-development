/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const dotenv = require('dotenv').config();
const Shopify = require('shopify-api-node');
const BILLING_TABLE = require('../../../../utils/billingFormat');
const User = require('../../../../models/user.model');

const { host, env } = require(`../../../../config/env`);
const saveUserDetailsToDB = require('../../../../utils/user/saveUserDetailsToDB');
// const { shopifyInstance } = require('@buckscc/common/shopify/instance.util');

exports.checkSubscriptionStatus = async (req, res) => {
    // Types of statuses
    const STATUS_ACTIVE = 'active';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';
    const STATUS_CANCELLED = 'cancelled';

    const { bucksccToken, accessToken, shop } = req.session;
    const user = {
        myshopify_domain: shop
    };

    const { charge_id: chargeIdFromQuery } = req.query;

    if (chargeIdFromQuery) {
        const shopify = new Shopify({
            shopName: shop,
            accessToken
        });
        const chargeStatus =
            (await shopify.recurringApplicationCharge
                .get(chargeIdFromQuery)
                .catch(err => console.log(`Error from recurringApp charge`, err.response.body))) || {};
        if ((chargeStatus || {}).status === STATUS_DECLINED) {
            console.log(`Recurring charge declined!`);
            const redirectUrl = `${host}/api/v1/redirect/billing/check`;
            const { charge_id, confirmation_url } = this.initiateRecurringCharge(shopify, redirectUrl);
            // Update charge_id to the user object for saving to DB
            user.charge_id = charge_id;
            await saveUserDetailsToDB(user);
            res.redirect(confirmation_url);
        } else {
            console.log(`Recurring charge Accepted!`);
            // 1. Update the DB with status
            user.subscription_status = chargeStatus.status;
            console.log(`Upadating subscription status to DB!`);
            await saveUserDetailsToDB(user);
            console.log(`Redirecting...!`);
            // 2. Redirect to dashboard
            res.redirect(`/?shop=${shop}&token=${bucksccToken}`);
        }
    } else res.status(400).send();
};

exports.initiateRecurringCharge = async (shopify, redirectUrl) => {
    // const { shop, accessToken } = req.session;
    // Get the object with end === null, and take it's price that will be the max chargeable amount
    const { price: cappedAmount } = BILLING_TABLE.find(price => !price.end);
    const trialDays = 30;
    // Create the recurring charge object
    const chargeParams = {
        capped_amount: cappedAmount,
        name: 'BucksCurrencyConverter Pricing Plan',
        price: 0,
        return_url: redirectUrl,
        test: env === 'development' ? true : null,
        trial_days: trialDays,
        terms: 'FREE up to 50 orders per month then starts at $9.99'
    };
    const { id: charge_id, confirmation_url } = await shopify.recurringApplicationCharge
        .create(chargeParams)
        .catch(err => {
            console.log(`Error from RecurringCharge`, err.response.body);
            return false;
        });
    return { charge_id, confirmation_url };
};

exports.initiateBilling = async (req, res) => {
    const { shop, accessToken } = req.session;
    const shopify = new Shopify({
        shopName: shop,
        accessToken
    });
    // Get recurring charge id of the user
    const { charge_id } = await User.find({ myshopify_domain: shop }, '+charge_id').catch(err =>
        console.log(`err from user: ${err}`)
    );

    // get order count of current user
    const orderCount = 250;

    // get usage price based on the orderCount
    const { price } = BILLING_TABLE.find(priceEntry =>
        priceEntry.end ? priceEntry.start <= orderCount && priceEntry.end <= orderCount : !priceEntry.end
    );
    const priceDescription = `Billing against ${orderCount} Orders.`;

    // Initiate usage based billing
    shopify.usageCharge.create(charge_id, {
        description: priceDescription,
        price
    });
};
