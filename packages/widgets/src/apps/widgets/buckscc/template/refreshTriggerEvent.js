import doPageConvert from '../convert/doPageConvert';
import multiCurrency from '../common/multiCurrency';

export default function refreshtriggerEventListener() {
    const { config } = bucksCC;
    const $list = hxo$('ul.buckscc-select-options');
    const $styledSelect = hxo$('div.buckscc-select-styled');
    const $this = hxo$(this);

    // remove events
    hxo$('.buckscc-select-options .converterTriggers').off();
    // re add events
    hxo$('.buckscc-select-options .converterTriggers').on('click', function(e) {
        const to = hxo$(this).attr('id');

        const id = hxo$(this).attr('id');

        // hide selected option from selector list
        if (config && config.selectedCurrencies && config.selectedCurrencies.selectedCurrencies > 1) {
            hxo$(this)
                .addClass('hxoSelected')
                .siblings()
                .removeClass('hxoSelected');
        }

        const selectedVal = `<div class="flagWrapper"><div class="hxoFlag hxoFlag-${id}"></div></div><span class="bucks-selected">${id}</span> `;
        $styledSelect.html(selectedVal).removeClass('active');
        $this.val(id);
        $list.hide();

        // doPageConvert(config, to);
        if (config.multiCurrencyEnabled) {
            const triggerMode = 'manual';
            multiCurrency(to, triggerMode);
        } else {
            doPageConvert(config, to);
        }
    });
}
