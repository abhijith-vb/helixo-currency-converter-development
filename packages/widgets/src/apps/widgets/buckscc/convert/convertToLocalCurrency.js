import getCountryCode, { getCountryApi } from '../helper/getCountryCode';
import doPageConvert from './doPageConvert';
import showSelectedCurrency from '../showSelectedCurrency';
import isUserSelectedCurrency from '../helper/isUserSelectedCurrency';
import geoCurrency from '../storage/geoCurrency';
import multiCurrency from '../common/multiCurrency';
import changeMultiCurrency from '../common/changeMultiCurrency';
import countryCurrency from '../common/countryCurrency';
import addGeoCurrency from '../template/addGeoCurrency';
import { isBucksAdminPage } from '../../../utils/isPageType';

export default function convertToLocalCurrency(config) {
    function doConverToGeoCurrency(currency) {
        if (isUserSelectedCurrency(config, currency)) {
            if (
                config.multiCurrencyEnabled &&
                config.multiCurrencies &&
                config.multiCurrencies.length > 1 &&
                config.cartCurrency
            ) {
                if (!config.multiCurrencyForceReload) {
                    debugger;
                    if (hxo$('span.money').length !== 0) {
                        changeMultiCurrency(currency, config);
                        showSelectedCurrency(currency);
                        doPageConvert(config, currency);
                    }
                } else {
                    multiCurrency(currency, 'manual');
                }
            } else {
                doPageConvert(config, currency);
                showSelectedCurrency(currency);
            }
        }
    }

    const storedGeoCurrency = geoCurrency.get();
    if (storedGeoCurrency) {
        doConverToGeoCurrency(storedGeoCurrency);
        addGeoCurrency();
    } else if (!(config.isMerchant || isBucksAdminPage)) {
        window.isBucksAdminPage = isBucksAdminPage;
        getCountryCode()
            .then(locationData => locationData.json())
            .then(locationData => {
                const { handle: country } = ((locationData || {}).detected_values || {}).country;
                const currency = countryCurrency[country];
                console.log(currency);
                geoCurrency.set(currency);
                doConverToGeoCurrency(currency);
                addGeoCurrency();
            });
    } else {
        getCountryApi().then(localCurrency => {
            geoCurrency.set(localCurrency);
            doConverToGeoCurrency(localCurrency);
            addGeoCurrency();
        });
    }
}
