// set auto selected currency as selected in the select box
export default function showSelectedCurrency(localCurrency) {
    const { config } = bucksCC;
    if (!config.hideCurrencySelector && localCurrency)
        if (
            config.themeType === 'modernLayered' ||
            config.themeType === 'select-round' ||
            config.themeType === 'default'
        ) {
            hxo$('div.buckscc-select-styled').html(
                `<div class="flagWrapper"><div class='hxoFlag hxoFlag-${localCurrency}'></div></div><span class="bucks-selected">${localCurrency}</span>`
            );

            if (config && config.selectedCurrencies && config.selectedCurrencies.selectedCurrencies > 1) {
                hxo$(`li#${localCurrency}`)
                    .addClass('hxoSelected')
                    .siblings()
                    .removeClass('hxoSelected');
            }
        }
}
