import selectedCurrencyLocal from '../storage/selectedCurrency';

const hoverEvent = () => {
    hxo$(document).ready(function() {
        hxo$('span.money').hover(
            function(e) {
                e.stopPropagation();
                // console.log('over');
                const currentCurrency = selectedCurrencyLocal.get();
                const originalPrice = hxo$(this).data('buckscc-originalPrice');
                const isHoverpriceExists = hxo$('span.money .hxo-hover-original-price').length === 0;
                if (currentCurrency !== bucksCC.config.baseCurrency && isHoverpriceExists && originalPrice) {
                    hxo$(this).append(
                        `<div class="hxo-hover-original-price hxo-slide-up"><span class="hxo-price-hover">${originalPrice}</span></div>`
                    );
                }
            },
            function(e) {
                hxo$(this)
                    .find('.hxo-slide-up')
                    .removeClass('hxo-slide-up');
                setTimeout(() => {
                    const isHoverpriceExists = hxo$('span.money .hxo-hover-original-price').length === 0;

                    if (!isHoverpriceExists) {
                        hxo$('span.money .hxo-hover-original-price').remove();
                    }
                }, 300);
            }
        );
    });
};
export default hoverEvent;
