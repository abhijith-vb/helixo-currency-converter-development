/* eslint-disable no-unused-expressions */
import { isEmpty, storageEngine } from '../common/helper/commonMethods';
import httpProvider from '../common/http/httpProvider';
export const initChatWidget = (user = null) => {

    function initFreshChat() {
        let USER = user;
        // json parse error handle hack
        try {
            USER = !isEmpty(user) ? JSON.parse(user) : user;
        } catch (error) { }

        const { shop_owner = '' } = USER;

        const splitName = shop_owner.split(' ') || [];
        let firstName;
        let lastName;

        if ((splitName[0] || '').length > 3) {
            firstName = splitName[0];
            lastName = splitName.slice(1).join(' ');
        } else firstName = shop_owner;

        const isNewUser =
            sessionStorage.getItem('isNewUser') === true || sessionStorage.getItem('isNewUser') === 'true';
        const restoreId = USER.restoreId || null;
        // console.log(`user`, user);
        // console.log(`USER`, USER);
        window.fcWidget.init({
            token: process.env.REACT_APP_FRESHCHAT_TOKEN,
            host: 'https://wchat.freshchat.com',
            siteId: 'buckscc.helixo.co',
            externalId: USER.myshopify_domain || null,
            restoreId: restoreId || null,
            // Show FAQ Category with 'ufe' tag
            faqTags: {
                // Array of Tags
                tags: ['bucks'],
                // For articles, the below value should be article.
                // For article category, the below value should be category.
                filterType: 'category', // Or filterType: 'article'
            },
            // "open": true,
            config: {
                cssNames: {
                    expanded: 'custom_fc_expanded',
                    widget: 'custom_fc_frame',
                },
            },
        });

        // Get user details
        window.fcWidget.user.get(function (userGetResponse) {
            const widget = document.querySelector('.fc-widget-small');

            const { status: userStatus, data: userData } = userGetResponse || {};

            console.log('user', userGetResponse);

            // find days ago
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const firstDate = new Date();
            const secondDate = new Date(USER.created_at);

            const daysAgo = Math.round(Math.abs((firstDate - secondDate) / oneDay));
            const daysOld =
                daysAgo / 30 < 1 ? `${daysAgo} days old` : `${Math.round(Math.abs(daysAgo / 30))} months old`;

            // Set user properties
            const userMetaProps = {
                'Shopify Payments': USER.eligible_for_payments || null,
                Currency: USER.currency || null,
                'Customer Email': USER.customer_email || null,
                multicurrencies:
                    (USER.enabled_presentment_currencies || []).length > 1
                        ? (USER.enabled_presentment_currencies || []).join(',')
                        : null || null,
                'Shop Created': daysOld || null,
                'Shopify Plan': `${USER.plan_display_name} - ${USER.plan_name}` || null,
                'UFE Plan': USER.ufe_plan || 'free',
                'Shop Name': USER.name || null,
            };

            // Only add if password enabled
            if (USER.password_enabled === 'true' || USER.password_enabled === true)
                userMetaProps['Password Enabled'] = '🔐';
            else userMetaProps['Password Enabled'] = null;

            // Main properties
            const userProps = {
                firstName, // user's first name
                lastName, // user's last name
                email: USER.email || null,
                phone: USER.phone || null,
            };

            // If user doesn't exist, then set user props
            if (userStatus !== 200) {
                window.fcWidget.user.setProperties({ ...userProps, ...userMetaProps });
                window.fcWidget.on('user:created', function (resp) {
                    const status = resp && resp.status;
                    const data = resp && resp.data;
                    if (status === 200) {
                        if (data.restoreId) {
                            // Update restoreId in your database
                            console.log(`restoreid`, data.restoreId);
                            httpProvider
                                .postAction('api/v1/user/restoreId', { restoreId: data.restoreId })
                                .then((res) => {
                                    console.log(`saved restoreId`);
                                });
                        }
                    }
                });
            } else {
                window.fcWidget.user.update({ ...userProps, meta: { ...userMetaProps } }).then((updateResp) => {
                    console.log(updateResp);
                });
            }
        });
        // Auto open after 15 seconds
        // isNewUser &&
        //     setTimeout(() => {
        //         window.fcWidget.open();
        //     }, 15000);
    }
    function initialize(i, t) { var e; i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e)) } function initiateCall() { initialize(document, "freshchat-js-sdk") }
    initiateCall();
}

export const initGoogleTagManager = () => {
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            "gtm.start": new Date().getTime(),
            event: "gtm.js",
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-MJKW6S8");
}

export const initHotjarAnalytics = () => {
    (function (h, o, t, j, a, r) {
        h.hj =
            h.hj ||
            function () {
                (h.hj.q = h.hj.q || []).push(arguments);
            };
        h._hjSettings = { hjid: 1420238, hjsv: 6 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(
        window,
        document,
        "https://static.hotjar.com/c/hotjar-",
        ".js?sv="
    );
}
// export initHotjarAnalytics;
// exports.initGoogleTagManager = initGoogleTagManager;
// exports.initChatWidget = initChatWidget;