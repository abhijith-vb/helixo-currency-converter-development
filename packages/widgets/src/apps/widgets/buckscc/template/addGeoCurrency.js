import geoCurrencyStorage from '../storage/geoCurrency';
import refreshTriggerEvent from './refreshTriggerEvent';

const addGeoCurrency = () => {
    const { config } = bucksCC;
    const geo = geoCurrencyStorage.get();
    if (geo != null && config.showAutoLocationEntry && !config.autoSwitchOnlyToPreferredCurrency) {
        const content = `<li class="geoCurrency converterTriggers" id="${geo}" rel="${geo}"><div class="flagWrapper"><div class="hxoFlag hxoFlag-${geo}"></div></div><span class="bucksItem">Auto Location</span></li>`;
        if (hxo$('.geoCurrency').length === 0) {
            hxo$('.buckscc-select-options').prepend(content);
        } else {
            hxo$('.geoCurrency').replaceWith(content);
        }

        // select converter trigger event
        refreshTriggerEvent(config);
    }
};
export default addGeoCurrency;
