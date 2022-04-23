import currencyRateLocal from '../storage/currencyRates';
import { isEmpty } from '../../../utils/helper';
// will load currency from store for first time for each day
// consequent loads will fetch currency stored in localStorage
export default function getCurrency(config) {
    const { demoMode } = config;
    return new Promise((resolve, reject) => {
        const rates = currencyRateLocal.get();
        if (!isEmpty(rates)) {
            resolve(rates);
        } else {
            // api to proxy the currency url from https://buckscc-demo.myshopify.com/services/javascripts/currencies.js
            const url = demoMode
                ? 'https://buckscc.helixo.co/api/v1/public/currency'
                : '/services/javascripts/currencies.js';
            hxo$.ajax({
                type: 'GET',
                url,
                async: false,
                success(res) {
                    resolve(res);
                },
                error(err) {
                    reject(err);
                }
            });
        }
    });
}
