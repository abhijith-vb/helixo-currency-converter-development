/* eslint-disable no-plusplus */
import changeMultiCurrency from '../common/changeMultiCurrency';
import refreshTriggerEvent from './refreshTriggerEvent';

const events = config => {
    hxo$('select.buckcc').each(function() {
        let styles = '';
        if (!config.darkMode) {
            styles += `--hxoBackground: ${bucksCC.config.backgroundColor} !important;--hxoSelect-color: ${bucksCC.config.textColor} !important;--hxoHover-bg:${bucksCC.config.hoverColor}`;
        }

        const $this = hxo$(this);
        const numberOfOptions = hxo$(this).children('option').length;

        const { cartCurrency } = (window.bucksCC || {}).config || {};
        $this.addClass('buckscc-select-hidden');
        $this.wrap(`<div class="buckscc-select" style="${styles}"></div>`);

        let styledSelect = `<div class="buckscc-select-styled" `;
        if (!config.darkMode) {
            // styledSelect += ` onmouseover="this.style.backgroundColor='${bucksCC.config.hoverColor}';" onmouseout="this.style.backgroundColor='${bucksCC.config.backgroundColor}';"}`;
        }
        styledSelect += `></div>`;

        $this.after(styledSelect);

        // events to add values custom styled select element
        const $styledSelect = $this.next('div.buckscc-select-styled');
        $styledSelect.html(
            `<div class="flagWrapper"><div class='hxoFlag hxoFlag-${cartCurrency}'></div></div><span class="bucks-selected">${cartCurrency}</span>`
        );

        const $list = hxo$('<ul />', {
            class: 'buckscc-select-options',
            style: styles
        }).insertAfter($styledSelect);

        for (let i = 0; i < numberOfOptions; i++) {
            hxo$('<li />', {
                html: `<span class="bucksItem">${$this
                    .children('option')
                    .eq(i)
                    .text()}</span>`,
                class: 'converterTriggers',
                id: $this
                    .children('option')
                    .eq(i)
                    .val(),
                rel: $this
                    .children('option')
                    .eq(i)
                    .val()
            })
                .prepend(
                    `<div class="flagWrapper"><div class='hxoFlag hxoFlag-${$this
                        .children('option')
                        .eq(i)
                        .val()}'></div></div>`
                )
                .appendTo($list);
        }

        const $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            hxo$('div.buckscc-select-styled.active')
                .not(this)
                .each(function() {
                    hxo$(this)
                        .removeClass('active')
                        .next('ul.buckscc-select-options')
                        .hide();
                });
            hxo$(this)
                .toggleClass('active')
                .next('ul.buckscc-select-options')
                .toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
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
        });

        hxo$(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });
    });

    // select converter trigger event
    refreshTriggerEvent(config);
};

export default events;
