/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const User = require('../../models/user.model');

const { ADMIN_STORES } = require(`../../../config/env`);

/**
 * Function to overwrite current session with Merchant session
 */
async function setDevModeSesssion(req, res, next) {
    // Get dev mode params and shop to access from url
    let { dev, shop, back } = req.query;

    // Get the current logged in shop
    const { shop: adminShop, accessToken, dev: isDevLoggedIn, devShop, devToken } = req.session;

    // Going back to admin
    if (dev && back && isDevLoggedIn && devShop && devToken) {
        req.session.shop = devShop;
        req.session.accessToken = accessToken;
        req.session.devShop = undefined;
        req.session.devToken = undefined;
        return res.redirect('/merchants');
    }
    // Check if the logged in shop defined in admin stores
    if (dev && ADMIN_STORES.includes(adminShop)) {
        // Ye! I'm admin. I can access any store.
        console.log(`Going to merchant store`);

        // If shop parameter missing myshopify subdomain add it
        shop = shop.indexOf('.myshopify.com') === -1 ? `${shop}.myshopify.com` : shop;

        try {
            // Get details of the merchant to log in
            const merchantDetails = await User.findOne({ myshopify_domain: shop }).lean();

            if (merchantDetails) {
                // Overwrite current session with merchant details
                req.session.accessToken = merchantDetails.accessToken;
                req.session.shop = shop;
                req.session.dev = true;
                req.session.devShop = adminShop;
                req.session.devToken = accessToken;
                res.redirect('/');
            }
        } catch (err) {
            console.log(`Error from dev mode`, err);
            return res.sendStatus(404);
        }
    } else return res.sendStatus(404);
}

module.exports = { setDevModeSesssion };
