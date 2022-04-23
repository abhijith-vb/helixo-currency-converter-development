/* eslint-disable no-undef */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable default-case */
/* eslint-disable no-eval */
/* 
* Export individual add-to-cart-animate script from here
! Rules to consider
--------------------
* Always use unique names for class names, function names
?       - Eg: use <div class="ess_header"></div> instead of <div class="header"></div>
* Don't write css styles directly to html tags - names might conflict with shopify html elements
?       - Eg: use .ess_header { color: red } instead of .header { color: red }

! Commands to help dev flow
---------------------------
* Use `npm run watch` to run full bundle watch
* Use `npm run watch widget=countdown_timer` to watch only countdown_timer
*   - If getting error then use `npm run watch -- --environment widget:currency-converter`
* Use `npm run watch:serve` to watch and listen and serve to localhost:5000 (Default serve from /dist/widgets/)
*   - widget=countdown_timer along with watch:serve is not supported
*/

// import './themes/default.scss';
import './themes/banner.scss';

import JQ from '../../utils/getJquery';
import appendItem from '../../utils/appendToHeader';
import { eStore } from '../../utils/storageEngine';
import initialize from './initialize';
import getCurrency from './helper/getCurrency';
import isGoogleAds from './helper/isGoogleAnalytics';
import getUserConfig from './helper/getUserConfig';
import isRendered from './helper/isRendered';
// import countryCurrency from "./countryCurrency";
// import currencyRates from "./currencyRates";
window.eStore = eStore;
window.bucksCC = window.bucksCC || {};

const initapp = isRendered.then(()=>{
    JQ.then($Q => {
    window.hxo$ = $Q;
    getUserConfig().then(config => {
        console.log(`INSIDE INIT`);
        /* 
    span.money:not(.buckscc-money) {
        color: transparent;
    }
    span.buckscc-money {
        color: inherit;
    }
    */

        //    disable converter for google ads
        const isDev = eStore.get('bucks_live_testing') || null;
        const isAds = isGoogleAds();
        if (
            (config.active && !isAds) ||
            __Env__ === 'testing' ||
            __Env__ === 'dev' ||
            isDev
        ) {
           
            getCurrency(config).then(rates => {
                hxo$(document).ready(function () {
                    initialize(config, rates);
                });
            });
        }
    });
})
})

// initialize();
export default initapp;
