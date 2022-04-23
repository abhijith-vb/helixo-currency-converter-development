/* eslint-disable prettier/prettier */
const Shopify = require('shopify-api-node');
const removeScriptTag = require('../../controllers/api/v1/settings/removeScriptTag');
const instantLoaderScript = require('../../controllers/api/v1/settings/instantLoaderScript');

/**
 * Function to inject the configuration data to the theme
 * @param {String} domain domain of this shop
 * @param {Object} data data to inject to the snippet
 * @param {String} additionalScripts additional script to be added to the theme
 */
const updateConfigurationInThemeSnippet = async (
    domain,
    shopifyInstance,
    data,
    req,
    additionalScripts
) => {
    try {
        let instantLoaderScriptContent = '';
        const newData = { ...data };
        console.log(newData)
        // Remove unwanted
        delete newData._id;
        delete newData.shop;

        // if (!isDevelopment) {
        const { shop, accessToken, currentThemeId } = req.session;

        // Assign shopify instance
        let shopify;
        if (!shopifyInstance) shopify = new Shopify({ shopName: shop, accessToken });
        else shopify = shopifyInstance;

        let themeId = currentThemeId;

        if (!themeId) {
            const themeLists = await shopify.theme.list();
            /* get published theme from list of themes */
            const mainTheme = themeLists.find(obj => obj.role === 'main');
            /* get theme id */
            themeId = mainTheme.id;

            // This is to avoid repeated calls to get the main theme id
            req.session.currentThemeId = themeId;
        }

        // If instant loader is activated then add the additional instant loader script to the theme
        if (data.instantLoader) {
            // await removeScriptTag(shopify);
            instantLoaderScriptContent = instantLoaderScript(domain, shop);
        }

        // Create the shopify inject javascript object
        const settingsInjectObject = `{%comment%} Currency converter Code: Don't Delete {%endcomment%}
        <script>
        window.bucksCC = window.bucksCC || {};
        window.bucksCC.config = {}; window.bucksCC.reConvert = function () {};
        "function"!=typeof Object.assign&&(Object.assign=function(n){if(null==n)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(n),t=1;t<arguments.length;t++){var e=arguments[t];if(null!=e)for(var o in e)e.hasOwnProperty(o)&&(r[o]=e[o])}return r});
        Object.assign(window.bucksCC.config, ${JSON.stringify(
            newData
        )}, { money_format: {{ shop.money_format | json }}, money_with_currency_format: {{ shop.money_with_currency_format | json }}, userCurrency: {{ shop.currency | json }} }); window.bucksCC.config.multiCurrencies = []; {% assign cu = shop.enabled_currencies | map: 'iso_code' | join: ',' %} window.bucksCC.config.multiCurrencies = "{{cu}}".split(',') || ''; window.bucksCC.config.cartCurrency = "{{ cart.currency.iso_code }}" || ''; ${instantLoaderScriptContent || ''} ${additionalScripts || ''}
        </script>`;

        // Updating the configuration code to the bucks-cc.liquid
        await shopify.asset.update(themeId, { key: 'snippets/bucks-cc.liquid', value: settingsInjectObject });
        console.log(`Configuration updated in shopify!!`, settingsInjectObject);
        return;
        // }
    } catch (err) {
        const error = (((err || {}).response || {}).body || {}).errors || err;
        console.log(`Error from updating to db`, error);
        // throw new APIError(err);
    }
};

module.exports = updateConfigurationInThemeSnippet;
