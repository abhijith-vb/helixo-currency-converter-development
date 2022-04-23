/* eslint-disable prettier/prettier */
/* eslint-disable no-eval */
import './themes/common.scss';
import './themes/select.scss';
import './themes/modernLayered.scss';
import currencyRatesStored from './storage/currencyRates';
import appendItem from '../../utils/appendToHeader';
import externalConverter from './convert/externalConverter';
import hoverEvent from './common/hover';

import addCartBanner from './common/cartBanner'
import autoSwitchCurrency from './autoSwitchCurrency'
import addWrapperDiv from './common/addWrapperDiv';
import commonEvents from './common/commonEvents';
import validateJson from './helper/validateJson'
import rerender from './rerender'
import setConfig from './setConfig';
import reConvert from './common/reconvert';
import allCurrencyFormats from './common/currencyFormats';


const initialize = (configs, rates) => {

    const storeConfig = { ...configs }

    // If Currency available in global scope then manually assign to bucksCC.Currency.rates
    window.bucksCC.Currency = {};

    // alternate for eval
    const ratesMatchRegex = /{(.*?)}/
    const tempCurrencyVal = validateJson(rates.match(ratesMatchRegex)[0])
    if (tempCurrencyVal && typeof (tempCurrencyVal.USD) === 'number') {
        window.bucksCC.Currency.rates = tempCurrencyVal
    }
    else {
        try {
            console.log('eval block');

            eval(rates);
            // If window.Currency available then eval is executed so get rates from it otherwise the rates variable from localstorage has the rates value in it, assign directly
            window.bucksCC.Currency.rates = window.Currency ? window.bucksCC.Currency.rates = window.Currency.rates : ''
        }
        catch {
            console.error('invalid rates');
            return
        }
    }


    // Store only the currency rates, assign convert function manually
    currencyRatesStored.set(rates);

    // Bind convert function manually
    window.bucksCC.Currency.convert = (amount, from, to) => {

        const { rates: currencyRates = [] } = window.bucksCC.Currency;
        return (amount * currencyRates[from]) / currencyRates[to];
    };
    let customCss = ``;

    let customJs = '';



    const config = setConfig(storeConfig);
    


    // add css/js from config and expert settings custom css/js to append to head
    const expertSettings = validateJson(config.expertSettings);
    if (expertSettings) {
        customCss += expertSettings.css;
        customJs += expertSettings.js;
    }
    appendItem.js(customJs);
    appendItem.css(customCss);

    // Widget Code Start

    // do convert on dom load, ajax call or input change events
    commonEvents(config)

    addWrapperDiv(config);

    // show price on hover event
    if (bucksCC.config.showOriginalPriceOnMouseHover) {
        hoverEvent();
    }

    // auto detect currency on load,
    // if previous selected currency is in storage will load that instead
    if (config.autoSwitchCurrencyLocationBased) {
        autoSwitchCurrency(config);
    }

    window.bucksCC.rerender = rerender;


    //   integrate with pages apps
    window.bucksCC.appConverter = externalConverter;

    // cart notification
    if (bucksCC.config.cartNotificationStatus) {
        addCartBanner(config);
    }
    // do full page convert global function

    window.bucksCC.reConvert = reConvert;
    window.bucksCC.currencyFormats = allCurrencyFormats;


};

export default initialize;




