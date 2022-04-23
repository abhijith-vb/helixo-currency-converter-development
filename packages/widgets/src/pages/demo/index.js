/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import getJQ from '../../apps/utils/getJquery';
import { eStore } from '../../apps/utils/storageEngine';

getJQ.then(jQ => {
    window.hxo$ = jQ;
    /**
     * Receive message from parent
     */
    window.onmessage = function (e) {
        const { action, data } = e.data;
        if (!data) return;
        const configData = JSON.parse(data) || {};

        // disable multi currency for demo
        configData.multiCurrencyEnabled = false;
        configData.isMerchant = true;

        // if the displayPostionType is header or customposition then place it floating with top right position
        if (configData.displayPositionType !== 'floating') {
            configData.displayPositionType = 'floating';
            configData.displayPosition = 'top_right';
        }
        switch (action) {
            case 'preview': {
                if (window.bucksCC && window.bucksCC.rerender) {
                    window.bucksCC.rerender(configData);
                }

                break;
            }
            case 'delete': {
                (data || []).forEach(row => {
                    const { uuId } = row;
                    hxo$(`#${uuId}`).html('');
                });
                break;
            }
            default:
                break;
        }
    };

    /**
     * Send message to parent
     */
    function messageToParent(message) {
        window.top.postMessage(message, '*');
    }

    // Pull data from parent on load
    messageToParent({
        action: 'initialLoad'
    });
});
