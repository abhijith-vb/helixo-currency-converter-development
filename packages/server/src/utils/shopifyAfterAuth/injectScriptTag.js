const saveUserDetailsToDB = require('../user/saveUserDetailsToDB');
const { host } = require('../../config/env');

module.exports = function injectScriptTag(shopify, shop, user) {
    const { domain } = user || {};
    let scriptUrl;
    if (!domain) scriptUrl = `${host}/widgets/buckscc/sdk.min.js`;
    else scriptUrl = `https://${domain}/apps/buckscc/sdk.min.js`;
    shopify.scriptTag
        .create({
            event: 'onload',
            src: scriptUrl
        })
        .then(docs => {
            console.log(`sdk injected : `, docs);
            if (docs) {
                const scriptTagId = (docs || {}).id;
                console.log(`SCRIPT TAG ID: `, scriptTagId);
                // Save script id to DB
                saveUserDetailsToDB({
                    myshopify_domain: shop,
                    scriptTagId
                });
                console.log(`ScriptTagId updated in DB`);
            }
        })
        .catch(err => {
            console.log(err);
        });
};
