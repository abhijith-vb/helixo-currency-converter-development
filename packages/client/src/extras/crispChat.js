/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
// import * as Sentry from '@sentry/browser';

import http from '../common/http/httpProvider';
import { uuId, isEmpty, capitalize, storageEngine } from '../common/helper/commonMethods';
// import { STARTUP_STORE_AGE, AVAIL_STARTUP_PLAN, SENT_QUERY, OPEN_CHAT, HELP_MESSAGE } from '../common/constants';
import { OPEN_CHAT,SENT_QUERY } from '../common/constants/constants';
import supportHours from '../common/common-methods/supportHours'

// import chatStore from './storageEngine';

// export const CHAT_CONFIG_KEY = 'dinosellChatConfig';

// export const TRIGGER_REMOVE_WATERMARK = 'REMOVE WATER MARK';
// export const COMMON_HELP_TRIGGER = 'COMMON HELP TRIGGER';

/**
 * get mix panel instance
 */
// const { mixpanel = {} } = window || {};
/**
 * Trigger message regarding remove water mark
 */
// export const WATERMARK_REMOVE_MESSAGE = `Congrats, your store is eligible for an upgrade to the premium account for a limited time.

// Do you want to claim it?`;
export const NEED_HELP_MESSAGE = `Hi {{firstname}}, How may I help you?`;

/**
 * Get required user details
 */
const getRequiredUserDetails = (user) => {
    let USER = user;
    // json parse error handle hack
    try {
        USER = !isEmpty(user) ? JSON.parse(user) : user;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    const { shop_owner = '' } = USER;

    const splitName = shop_owner.split(' ') || [];
    let firstName;
    let lastName;

    if ((splitName || []).length > 1) {
        // eslint-disable-next-line prefer-destructuring
        firstName = splitName[0];
        lastName = splitName.length > 1 ? splitName.slice(1).join(' ') : '';
    } else {
        firstName = shop_owner;
        lastName = '';
    }

    firstName = capitalize(firstName);
    // find days ago
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const TODAY = new Date();
    const storecreatedDate = new Date(USER.created_at);
    const firstInstalledDate = new Date(USER.first_installed);

    const daysAgo = (sDate) => Math.round(Math.abs((TODAY - sDate) / oneDay));
    const daysOld = (date) => {
        const dayAgo = daysAgo(date);
        return dayAgo / 30 < 1 ? `${dayAgo} days old` : `${Math.round(Math.abs(dayAgo / 30))} months old`;
    };
    const storeAge = daysOld(storecreatedDate);
    const daysInApp = daysOld(firstInstalledDate);
    const userMetaProps = {
        shopifyPayments: USER.eligible_for_payments || 'No',
        myShopifyDomain: USER.myshopify_domain || 'Domain not available',
        Currency: USER.currency || '',
        customerEmail: USER.customer_email || '',
        multicurrencies:
            (USER.enabled_presentment_currencies || []).length > 1
                ? (USER.enabled_presentment_currencies || []).join(',')
                : 'No',
        shopCreated: storeAge || '',
        shopifyPlan: `${USER.plan_display_name} - ${USER.plan_name}` || '',
        shopName: USER.name || '',
        accessCount: USER.access_count || '',
    };
    // Only add if password enabled
    if (USER.password_enabled === 'true' || USER.password_enabled === true) userMetaProps.passwordEnabled = '🔐';
    else userMetaProps.passwordEnabled = 'No';

    // add review
    if (USER.externalFeedback === 'true' || USER.externalFeedback === true) userMetaProps.bucksReviewed = '⭐️⭐️⭐️⭐️⭐️';
    else userMetaProps.bucksReviewed = 'No';
    // Main properties
    const userProps = {
        firstName, // user's first name
        lastName, // user's last name
        email: USER.email || '',
        phone: USER.phone || '',
    };
    return { ...userProps, ...userMetaProps };
};

const embedChatScript = () => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = '4576acd9-854f-49e9-9d66-59e9d81c8c11';
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = 1;
    d.getElementsByTagName('head')[0].appendChild(s);
};

const messageSentEvent = (e) => {
    const user = storageEngine.get('user');
    const firstMessageLocal = storageEngine.get('isFirstMessageSent', true);
    const { crispChat: { firstMessage } = {} } = user || {};
    const isTriggerSent = storageEngine.get('crispTriggerFired', true, 'session');
    const crispTokenLocal = storageEngine.get('crispTokenLocal', true);
    const isFirstMessageSent = firstMessage || firstMessageLocal;
  
    /**
     * Log users first message to db and mixpanel
     */
    if (!isFirstMessageSent) {
        // eslint-disable-next-line no-unused-expressions
        // mixpanel.track &&
        //     mixpanel.track('First message sent', {
        //         content: e && e.content,
        //     });
        const payload = {
            id: crispTokenLocal,
            history: [crispTokenLocal],
            firstMessage: true,
        };
        http.postAction('api/v1/user/updateChatToken', payload);
        storageEngine.set('isFirstMessageSent', true);
    }
};
/**
 * Initialize live chat widget
 * @param {Function} fn callback function
 */
export const initLiveChat = (user, fn = () => {}) => {
    // const user = getUserDetails() || {};
    // window.Tawk_API = window.Tawk_API || {};
    const { crispChat: { id: crispId, firstMessage } = {} } = user || {};
    const UUID = crispId || btoa(user.myshopify_domain) + uuId(15);
    storageEngine.set('crispTokenLocal', UUID);
    /**
     * Shopify domain is used as crisp token id, inorder to restore the previous chats.
     */
    window.CRISP_TOKEN_ID = crispId || UUID;
    embedChatScript();
    window.CRISP_READY_TRIGGER = () => {
        const userMetaData = getRequiredUserDetails(user);
        setTimeout(() => {
            try {
                const { $crisp } = window;
                $crisp.push(['set', 'user:nickname', [user.shop_owner]]);
                $crisp.push(['set', 'session:data', [Object.entries(userMetaData)]]);
                $crisp.push(['set', 'user:email', [user.email]]);
                $crisp.push(['set', 'user:company', ['🟢 🟢 🟢 - BUCKS']]);
                $crisp.push(["set", "session:segments", [["chat", "bucks"], true]])
                // $crisp.push(['on', 'message:sent', messageSentEvent]);
                fn();
                if (!crispId) {
                    const payload = {
                        id: UUID
                    };
                    http.postAction('api/v1/user/updateChatToken', payload);
                }
            } catch (error) {
                // Sentry.setTag('shop', user.myshopify_domain);
                // Sentry.withScope((scope) => {
                //     scope.setExtras({
                //         component: 'crisp chat',
                //         section: 'failed to initalize session data',
                //         userMetaData,
                //         CRISP_TOKEN_ID: window.CRISP_TOKEN_ID,
                //         shopOwner: user.shop_owner,
                //         myshopifyDomain: user.myshopify_domain,
                //     });
                //     const eventId = Sentry.captureException(error);
                // });
            }
        }, 0);
    };
};

/**
 * Check wheather the user is eligible for showing triggered message
 */
// const validUser = () => {
/**
 * User details
 */
// const user = getUserDetails();
// /**
//  * @param {String} dinosell_plan Dinosell active plan
//  * @param {String} plan_name Shopify active plan
//  */
// const { dinosell_plan, plan_name = '' } = user || {};
// return (
//     (!dinosell_plan || dinosell_plan === 'free') &&
//     !plan_name.match(/^(affiliate|partner_test|staff_business|staff|trial|custom)$/)
// );
// };

/**
 * Type of trigger message to be shown
 * @param {*} type type will be like remove water mark or need help.
 */
export const triggerMessage = (type, user = {}, queryMessage = '') => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const TODAY = new Date();
    const storecreatedDate = new Date(user.created_at);
    const storeAge = Math.round(Math.abs((TODAY - storecreatedDate) / oneDay));
    // eslint-disable-next-line prefer-const
    let message = null;
    const { triggeredMessage = {}, triggeredMessage: { isTriggeredWatermarkMsg, isTriggeredCommonHelpMsg } = {} } =
        user || {};
    const isValid = user.plan_name && !!user.plan_name.match(/^(basic|trial|partner_test)$/);
    const { $crisp } = window;
    const isSupportHours = supportHours() || false;
    if(!isSupportHours) return;
    // $crisp.push(['do', 'trigger:run', ["'ufe_startup_plan_trigger'"]]);
    // $crisp.push(['set', 'session:event', [[['ufe_startup_plan_trigger']]]]);

    switch (type) {
        // case HELP_MESSAGE:
        //     $crisp.push(['set', 'session:event', [[['initial_help_trigger']]]]);
        //     break;
        // case AVAIL_STARTUP_PLAN:
        //     if (isValid && +storeAge < STARTUP_STORE_AGE) {
        //         $crisp.push(['set', 'session:event', [[['ufe_startup_plan_trigger']]]]);
        //         storageEngine.set('crispTriggerFired', true, 'session');
        //     }
        //     break;
        case SENT_QUERY:
            $crisp && $crisp.push(['do', 'message:send', ['text', queryMessage]]);
            $crisp.push(['do', 'chat:open']);
            break;
        case OPEN_CHAT:
            $crisp && $crisp.push(['do', 'chat:open']);
            break;
        default:
            break;
    }
    if (message) {
        // $crisp.push(['set', 'session:event', [[['ufe_startup_plan_trigger']]]]);
        // storageEngine.set('crispTriggerFired', true, 'session');
        $crisp && $crisp.push(['do', 'message:show', ['text', message]]);
    }
};
