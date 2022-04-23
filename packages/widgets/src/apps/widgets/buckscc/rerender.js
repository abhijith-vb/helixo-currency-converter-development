import addWrapperDiv from './common/addWrapperDiv';
import autoSwitchCurrency from './autoSwitchCurrency';
import selectedCurrencyLocal from './storage/selectedCurrency';
import showSelectedCurrency from './showSelectedCurrency';
import doPageConvert from './convert/doPageConvert';
import isUserSelectedCurrency from './helper/isUserSelectedCurrency';
import isMultiCurrency from './helper/isMultiCurrency';
import multiCurrency from './common/multiCurrency';
import setConfig from './setConfig';

const rerender = (storeConfig = window.bucksCC && window.bucksCC.config) => {
    const config = setConfig(storeConfig, true);
    const currencyBox = config.isShortCode ? '.buckscc-currency-wrapper' : '.buckscc-currency-box';
    const isWrapperExists = !!hxo$(currencyBox).length;
    if (isWrapperExists) {
        hxo$(currencyBox).detach();
    }
    if (hxo$('.buckscc-floating-box').length) hxo$('.buckscc-floating-box').detach();
    addWrapperDiv(config);
    if (config.autoSwitchCurrencyLocationBased) autoSwitchCurrency(config)
    else{
        const currentCurrency = selectedCurrencyLocal.get();
    if (currentCurrency != null && isUserSelectedCurrency(config, currentCurrency)) {
        /*
         * Dont do conversion if on multi currency
         * Show selected currency anyway
         */
        if (!isMultiCurrency(config, currentCurrency)) {
            doPageConvert(config, currentCurrency);
            showSelectedCurrency(currentCurrency);
        } else {
            const triggerMode = 'auto';
            multiCurrency(currentCurrency, triggerMode);
        }

        //  else if (hxo$('span.money').length !== 0) {
        //     // changeMultiCurrency(currentCurrency);
        //     doPageConvert(config, currentCurrency);
        // }
        // showSelectedCurrency(currentCurrency);
    }
    }
};
export default rerender;
