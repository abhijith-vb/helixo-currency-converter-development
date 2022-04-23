import selectedCurrency from '../storage/selectedCurrency';
import doPageConvert from '../convert/doPageConvert';
import changeMultiCurrency from './changeMultiCurrency';
import { eStore } from '../../../utils/storageEngine';

const multiCurrency = (currency, triggerMode = 'auto') => {
    /**
     * @param {string} triggerMode - possible values auto/manual.show either the event trigger by customer or automatic .
     */

    const { config } = window.bucksCC;
    const currentCurrency = selectedCurrency.get();


    const doPageReload =()=>{
        console.log('**********************************');
        console.log(`trigger mode - ${triggerMode}`);
        console.log('**********************************');
        const autoReloadConfig = eStore.get('autoReload') || {};
    
        if(triggerMode === 'manual' ||  (triggerMode === 'auto' && (autoReloadConfig || '') !== window.location.pathname)){
            triggerMode === 'auto' &&eStore.set('autoReload',window.location.pathname);
            bucksCC.config.reloadPending = true;
            window.location.reload();
        }
        else if(triggerMode === 'auto'){
            bucksCC.errors.push('infinite reload issue')
        }
    }

    /**
     * is Store multi currency enabled or not
     */

    if (config.multiCurrencyEnabled && !config.reloadPending) {
        /**
         * is target currency is a multi currency ?
         */
        if (config.baseCurrency === currency ) {
            doPageConvert(config, currency);
            return;
        }
        if (config.multiCurrencies && (config.multiCurrencies || []).includes(currency)) {
            /**
             * do reload only on user triggerd events except on implicit mention on config
             */
            if (triggerMode === 'manual' || config.multiCurrencyForceReload) {
                selectedCurrency.set(currency);
                
                changeMultiCurrency(currency, config)
                    .then(() => {
                        doPageReload();
                    })
                    .catch(error => console.log(error));
            } else if (config.cartCurrency !== config.baseCurrency) {
                /**
                 * do convert only if already in a converted price
                 */
                doPageConvert(config, currency);
            }
        } else {
            /**
             * handles the case where targetcurrency is not a multi currency
             * Change to normal currency
             */
            // eslint-disable-next-line no-lonely-if
            if (hxo$('span.money').length === 0) {
                /*
                 * if no span money
                 * first update multi currency to store currency
                 * set selected currency in local to convert after reload
                 * do reload
                 */
                if (config.cartCurrency !== config.userCurrency) {
                    selectedCurrency.set(currency);
                   
                    changeMultiCurrency(config.userCurrency, config)
                        .then(() => {
                           doPageReload();

                        })
                        .catch(error => console.log(error));
                } else {
                    doPageConvert(config, currency);
                }
            } else {
                doPageConvert(config, currency);
            }
        }
    }

    
};

/**
 * end
 */

export default multiCurrency;
