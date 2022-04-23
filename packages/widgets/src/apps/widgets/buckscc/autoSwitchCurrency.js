import selectedCurrencyLocal from './storage/selectedCurrency';
import isUserSelectedCurrency from './helper/isUserSelectedCurrency';
import convertToLocalCurrency from './convert/convertToLocalCurrency';
import showSelectedCurrency from './showSelectedCurrency';
import doPageConvert from './convert/doPageConvert';
import isMultiCurrency from './helper/isMultiCurrency';
import multiCurrency from './common/multiCurrency';
import changeMultiCurrency from './common/changeMultiCurrency';
import addGeoCurrency from './template/addGeoCurrency';

const autoSwitchCurrency = () => {
    const { config } = bucksCC;
    const currentCurrency = selectedCurrencyLocal.get();
    addGeoCurrency();

    if (currentCurrency != null && isUserSelectedCurrency(config, currentCurrency)) {
        /*
         * Dont do conversion if on multi currency
         * Show selected currency anyway
         */
        if (!isMultiCurrency(config, currentCurrency)) {
            doPageConvert(config, currentCurrency);
        }
        showSelectedCurrency(currentCurrency);
    } else convertToLocalCurrency(config);
};
export default autoSwitchCurrency;
