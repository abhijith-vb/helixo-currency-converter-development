import validateJson from './validateJson';

const getUserConfig = () =>
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
        if (
            window &&
            (window.location.href.includes('/checkouts/') ||
                window.location.href.includes('/thank_you') ||
                window.location.href.includes('/orders/'))
        ) {
            // api to proxy the currency url from https://buckscc-demo.myshopify.com/services/javascripts/currencies.js
            const payload = Shopify && Shopify.shop;
            const url = 'https://buckscc.helixo.co/api/v1/public/config';
            hxo$.ajax({
                type: 'POST',
                url,
                data: { shop: payload },
                async: false,
                success(res) {
                    window.bucksCC.config = res;
                    // eslint-disable-next-line no-unused-expressions
                    if (window.bucksCC.config && window.bucksCC.config.selectedCurrencies) {
                        const c = window.bucksCC.config.selectedCurrencies;
                        const cParced = validateJson(c);
                        if (cParced) {
                            window.bucksCC.config.selectedCurrencies = cParced;
                        }
                    }
                    resolve(res);
                },
                error(err) {
                    reject(err);
                }
            });
        } else {
            const { config = {} } = window.bucksCC;
            resolve(config);
        }
    });
export default getUserConfig;
