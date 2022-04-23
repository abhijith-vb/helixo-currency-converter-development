const changeMultiCurrency = (multi, config) =>
    new Promise((resolve, reject) => {
        if (config.multiCurrencies && (config.multiCurrencies || []).includes(multi)) {
            console.log('in multi currency');

            const payload = {
                form_type: 'currency',
                utf8: '✓',
                return_to: window.location.pathname,
                currency: multi
            };

            hxo$.ajax({
                type: 'POST',
                url: '/cart/update.js?initiator=bucks',
                data: hxo$.param(payload),
                dataType: 'json',

                success(e) {
                    if (window.bucksCC && window.bucksCC.config && window.bucksCC.config.cartCurrency !== multi) {
                        // window.bucksCC.config.cartCurrency = multi;
                    }
                    resolve(e);
                },
                error(err) {
                    // any error to be handled
                    reject(err);
                }
            });
        } else {
            resolve(true);
        }
    });
export default changeMultiCurrency;
