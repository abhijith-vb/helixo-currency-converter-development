import selectedCurrencyLocal from '../storage/selectedCurrency';
import showSelectedCurrency from '../showSelectedCurrency';
import doPageConvert from '../convert/doPageConvert';
import isUserSelectedCurrency from '../helper/isUserSelectedCurrency';
import isMultiCurrency from '../helper/isMultiCurrency';
import multiCurrency from './multiCurrency';
// eslint-disable-next-line import/no-useless-path-segments
// import changeMultiCurrency from '../common/changeMultiCurrency';

const reconvert = () => {
    const { config } = bucksCC;
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
};
export default reconvert;
