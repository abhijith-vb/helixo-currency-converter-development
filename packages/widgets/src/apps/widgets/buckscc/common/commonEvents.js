import addWrapperDiv from './addWrapperDiv';
import addCartBanner from './cartBanner';
import reconvert from './reconvert';
import debounce from '../../../../utils/debounce';
import throttle from '../../../../utils/throttle';
import { interceptAjaxCalls } from './interceptor';
import { reconvertOnInterval } from './reconvertOnInterval';

const commonEvents = function(config={}) {
    hxo$(window).on('load', function() {
        reconvert();
    });
    window.bucksCC.conveterInstance = null;
    
    const reconvertWithTimeout = () => {
        reconvert();
        setTimeout(() => {
            reconvert();
        }, 800);
    };
    // parse,filter and assign default values for custom triggers
    const trigger = (config.trigger || "").split(',').filter(x => x) || [];
    
    hxo$(function() {
        // conversion also done in settimeout if instant loader is active
        const doReconvert = () => {
            throttle(reconvertWithTimeout(), 1000);
        };
        interceptAjaxCalls();
        addWrapperDiv(config);
        doReconvert();
        // cart notification
        if (config.cartNotificationStatus) {
            addCartBanner(config);
        }
        setTimeout(() => {
            // hxo$(document).ajaxSuccess(
            //     throttle(()=> {
            //         reconvert();
            //         if (config.instantLoader) reconvertOnInterval(800, 3);
            //         else reconvertOnInterval();
            //         if (hxo$('#CartDrawer .buckscc-cart-banner').length === 0) {
            //             hxo$('.ajaxcart__inner').append('<div class="buckscc-cart-banner"></div>');
            //         }
            //     }, 1000)
            // );
            hxo$("form[action*='/cart'] input").on('change', function() {
                console.log('change');
                doReconvert();
            });
            hxo$("form[action*='/cart'] select").on('change', function() {
                doReconvert();
            });
            hxo$("input[type='radio']").on('change', function() {
                doReconvert();
            });
            hxo$("input[type='checkbox']").on('change', function() {
                doReconvert();
            });
            window.onpopstate = function(event) {
                doReconvert();
            };
            window.addEventListener('locationchange', function() {
                doReconvert();
            });
            trigger.map(triggerItem => {
                if (typeof triggerItem === 'string')
                    hxo$(triggerItem).bind('click change', function() {
                        doReconvert();
                    });
            });
            (function (history) {
                const { pushState } = history;
                history.pushState = function (state) {
                    if (typeof history.onpushstate === 'function') {
                        history.onpushstate({ state });
                    }
                    // ... whatever else you want to do
                    doReconvert();
                    return pushState.apply(history, arguments);
                };
            })(window.history);
            window.onresize = debounce(function() {
                console.log('Resized finished.');
                if (window.bucksCC) window.bucksCC.rerender();
            }, 500);
        }, 1000);
    });
};
export default commonEvents;
