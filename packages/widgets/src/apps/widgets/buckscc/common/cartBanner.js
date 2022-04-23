import selectedCurrencyLocal from '../storage/selectedCurrency';

const addCartBanner = config => {
    let { cartNotificationMessage, cartCurrency } = config;
    let styles = '';
    if (!config.darkMode) {
        styles = `background:${bucksCC.config.cartNotificationBackgroundColor}; color:${bucksCC.config.cartNotificationTextColor}`;
    }
    cartNotificationMessage = cartNotificationMessage.replace(/{STORE_CURRENCY}/gi, cartCurrency);
    const currentCurrency = selectedCurrencyLocal.get();
    const cartBannerElement =
        `<div class='ess-cart-banner hxoCartBanner ` +
        `${config.darkMode ? 'hxoDark' : ''}' style="${styles}">${cartNotificationMessage}</div>`;
    if (
        (window.location.href.includes('/cart') || window.location.href.includes('/products')) &&     
        !((config|| {}).multiCurrencies || []).includes(currentCurrency)
    ) {
        if (hxo$('.buckscc-cart-banner').length === 0 && window.location.href.includes('/cart')) {
            const cartBannerWrapper = `<div class='buckscc-cart-banner'></div>`;
            if (hxo$('body header').length) {
                hxo$('body header:eq(0)').append(cartBannerWrapper);
            } else {
                hxo$('body').prepend(cartBannerWrapper);
            }
        }
        cartNotificationMessage = cartNotificationMessage.replace(/{STORE_CURRENCY}/gi, cartCurrency);
        const currentCurrency = selectedCurrencyLocal.get();

        const cartBannerElement =
            `<div class='ess-cart-banner hxoCartBanner ` +
            `${config.darkMode ? 'hxoDark' : ''}' style="${styles}">${cartNotificationMessage}</div>`;
        if (
            (window.location.href.includes('/cart') || window.location.href.includes('/products')) &&
            !((config|| {}).multiCurrencies || []).includes(currentCurrency)
        ) {
            if (hxo$('.buckscc-cart-banner').length === 0 && window.location.href.includes('/cart')) {
                const cartBannerWrapper = `<div class='buckscc-cart-banner'></div>`;
                if (hxo$('body header').length) {
                    hxo$('body header:eq(0)').append(cartBannerWrapper);
                } else {
                    hxo$('body').prepend(cartBannerWrapper);
                }
            }
            if (hxo$('.buckscc-cart-banner').length > 0) {
                hxo$('.buckscc-cart-banner').html(cartBannerElement);
            }
        }
    }
};
export default addCartBanner;
