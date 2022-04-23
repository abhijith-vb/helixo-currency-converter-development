/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-console */
// const cheerio = require('cheerio');
const Shopify = require('shopify-api-node');
const User = require('../models/user.model');
const helper = require('./helper');
// const { saveObject } = require('./gcloudObjectStorage');
const { saveDetails } = require('./userFunctions');

exports.injectThemeSnippets = async (shopifyInstance = null, shop = null, isHookCall = false, userDetails, appSettings) => {
    /*
     * Inject get collection, tag of product script to product.liquid
     * This function is called when theme update hook is invoked
     */
    let shopify = shopifyInstance;
    if (!shopify && isHookCall) {
        shopify = await User.findOne({ myshopify_domain: shop }).then(resp => {
            const { accessToken } = resp;
            return new Shopify({
                shopName: shop,
                accessToken
            });
        });
    }
    const themeLists = await shopify.theme.list().catch(err => console.log('erro from getting theme', err));
    console.log('inside get theme');
    // console.log(docs);
    /* get published theme from list of themes */
    const main_theme = themeLists.find(obj => obj.role === 'main');

    /* get theme id */
    const themeId = main_theme.id;
    console.log('main theme', themeId);

    /**
     * Inject cart-template scripts
     */
    /**
     * CART PAGE INJECTION IS TEMPORARY STOPPED DUE TO THE BUG CAUSED BY DIFFERENT STORES
     */
    // await this.injectCartPageScripts(shop, shopify, themeId);
    /* Add bucks-cc.liquid file inside snippets
     * Shopify Node Api ISSUE Fix: https://github.com/MONEI/Shopify-api-node/issues/131#issuecomment-316163228
     */
    const defaultAppSettings = {
        active: false,
        userCurrency: 'IND',
        selectedCurrencies: ['USD', 'EUR'],
        autoSwitchCurrencyLocationBased: false,
        showCurrencySymbol: false,
        displayPosition: 'Bottom Left',
        showInDesktop: true,
        showInMobileDevice: true,
        showOriginalPriceOnMouseHover: false,
        cartNotificationStatus: false,
        cartNotificationMessage: 'This store process all orders in USD.',
        roundPriceStatus: false,
        roundingDecimal: 0.99,
        integrateWithOtherApps: true,
        themeType: 'theme1',
        backgroundColor: '#fff',
        textColor: '#333',
        hoverColor: '#ccc'
    };

    const settings = appSettings || defaultAppSettings;
 
    const ufeSnippet = `{%comment%} Currency converter Code: Don't Delete {%endcomment%}
    <script>
    window.bucksCC = window.bucksCC || {};
    window.bucksCC.config = {}; window.bucksCC.reConvert = function () {};
    "function"!=typeof Object.assign&&(Object.assign=function(n){if(null==n)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(n),t=1;t<arguments.length;t++){var e=arguments[t];if(null!=e)for(var o in e)e.hasOwnProperty(o)&&(r[o]=e[o])}return r});
    Object.assign(window.bucksCC.config, ${JSON.stringify(
        settings
    )}, { money_format: {{ shop.money_format | json }}, money_with_currency_format: {{ shop.money_with_currency_format | json }}, userCurrency: {{ shop.currency | json }} }); window.bucksCC.config.multiCurrencies = []; {% assign cu = shop.enabled_currencies | map: 'iso_code' | join: ',' %} window.bucksCC.config.multiCurrencies = "{{cu}}".split(',') || ''; window.bucksCC.config.cartCurrency = "{{ cart.currency.iso_code }}" || '';
    </script>`;

    try {
        console.log(`#1 Updating bucks-cc.liquid`);
        await shopify.asset.update(themeId, {
            key: 'snippets/bucks-cc.liquid',
            value: ufeSnippet
        });
        const themeLiquidFile = await shopify.asset.get(themeId, {
            'asset[key]': 'layout/theme.liquid'
        });

        if (!themeLiquidFile.value.includes("{% include 'bucks-cc' %}")) {
            console.log(`#3 Injecting Bucks Snippet to theme.liquid`);
            // Adding liquid code to include bucks-cc snippet to product.liquid
            const newData = themeLiquidFile.value.replace(
                '</head>',
                `{% include 'bucks-cc' %}
            </head>`
            );

            // Update product.liquid with added snippet code
            await shopify.asset.update(themeId, {
                key: 'layout/theme.liquid',
                value: newData
            });
        } else console.log('bucks-cc snippet already in the file');
        // Updating theme_liquid_snippet flag in user db
        const { future_injections } = userDetails;
        saveDetails(shop, {
            future_injections: { ...future_injections, theme_liquid_snippet: true }
        });
    } catch (err) {
        console.log(`Error from injecting`, err);
    }
};
