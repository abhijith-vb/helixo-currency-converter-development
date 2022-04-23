
import isEmpty from '../../../utils/helper';
import {reconvertOnInterval} from './reconvertOnInterval';
/**
 * Intercept change.js calls and do the calculations
 */
 const handleResponse =()=>{
     console.log('in interceptor');
     reconvertOnInterval();
 }
 export const interceptAjaxCalls = () => {
    const watchUrls = ['/cart/change.js', '/cart/change', '/cart/add.js', '/cart/update.js'];
    const { fetch } = window;

    // window.fetch = (...args) =>
    //     (async (args) => {
    //         const result = await fetch(...args);
    //         const url = ((result || {}).url || '').replace(new RegExp(`.*${document.domain}`), '');
    //         let cartItems = {};
    //         if (watchUrls.find((watchUrl = '') => (url || '').includes(watchUrl))) {
    //             try {
    //                 // cartItems = await result.clone().json();
    //                 // if (!isEmpty(cartItems) && (cartItems || {}).status !== 404 && (cartItems || {}).status !== 422) {
    //                     handleResponse(url);
    //                 // }
    //             } catch (err) {}
    //         }
    //         return result;
    //     })(args);

        window.fetch = (...args) =>
        ((args) => {
            return fetch(...args)
            .then(result=>{
                const url = ((result || {}).url || '').replace(new RegExp(`.*${document.domain}`), '');
            let cartItems = {};
            if (watchUrls.find((watchUrl = '') => (url || '').includes(watchUrl) && !((result || {}).url || '').includes('initiator=bucks'))) {
                try {
                    // cartItems = await result.clone().json();
                    // if (!isEmpty(cartItems) && (cartItems || {}).status !== 404 && (cartItems || {}).status !== 422) {
                        handleResponse(url);
                    // }
                } catch (err) {}
            }
            return result;
            })            
        })(args);


    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function (event = {}) {
            let url = ((event.target || {})._url || '').split('?');
            let param = url.length > 1?url[1]:null;
            url = url.length > 0 ? url[0] : null;
            if (watchUrls.find((watchUrl = '') => (url || '').includes(watchUrl)) && !((param || '').includes('initiator=bucks')) && this.readyState === 4) {
                // let cartItems = null;
                // try {
                //     cartItems = JSON.parse(this.responseText) || {};
                // } catch (err) {}
                // if (!isEmpty(cartItems) && (cartItems || {}).status !== 404 && (cartItems || {}).status !== 422) {
                    handleResponse(url);
                // }
            }
        });
        origOpen.apply(this, arguments);
    };
};