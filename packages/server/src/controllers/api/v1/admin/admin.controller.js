/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
const dayjs = require('dayjs');
const User = require('../../models/user.model');
const Analytics = require('../../models/analytics.model');

async function getMerchantsList(req, res, next) {
    const user = await User.find(
        {},
        'myshopify_domain email money_format domain first_installed last_used is_active uninstalls reinstall_offer_accept_count plan_name password_enabled'
    ).lean();
    const analytics = await Analytics.find({}, 'shop data').lean();
    // const refinedUser = user.map(u => ({
    //     ...u,
    //     analytics: [...analytics.filter(a => a.shop === u.myshopify_domain)],
    // }));
    const analyticsByShop = [];
    analytics.forEach(a => {
        if (a.shop in analyticsByShop) analyticsByShop[a.shop].push(a.data);
        else {
            analyticsByShop[a.shop] = [];
            analyticsByShop[a.shop].push(a.data);
        }
    });
    const refinedUser = user.map(u => ({
        ...u,
        analytics: (analyticsByShop[u.myshopify_domain] || []).reduce(
            (acc, data) => ({
                pageviews: data.pageviews + (acc.pageviews || 0),
                conversions: data.conversions + (acc.conversions || 0),
                conversionValue: data.conversionValue + (acc.conversionValue || 0),
                checkoutInits: data.checkoutInits + (acc.checkoutInits || 0),
                accepts: data.accepts + (acc.accepts || 0),
                rejects: data.rejects + (acc.rejects || 0),
            }),
            {}
        ),
    }));

    res.json(refinedUser);
}

async function getDailyAppStatus(req, res) {
    const date = new Date();
    const yesterday = date.setDate(date.getDate() - 1);
    User.find(
        { first_installed: { $gte: yesterday } },
        'plan_name country_code country_name uninstalls is_active last_uninstall'
    ).then(docs => {
        console.log(`users`, docs);

        const dailyUserStatus = {
            totalInstalls: docs.length,
            plans: {},
            countries: {},
        };
        docs.forEach(eachUser => {
            const countryName = eachUser.country_name.replace(/\s+/g, '');
            const { plan_name, is_active } = eachUser;
            dailyUserStatus.countries[countryName] = dailyUserStatus.countries[countryName]
                ? dailyUserStatus.countries[countryName] + 1
                : 1;
            dailyUserStatus.plans[plan_name] = dailyUserStatus.plans[plan_name]
                ? dailyUserStatus.plans[plan_name] + 1
                : 1;
            dailyUserStatus.sameDayUninstalls = !eachUser.is_active
                ? dailyUserStatus.sameDayUninstalls
                    ? dailyUserStatus.sameDayUninstalls + 1
                    : 1
                : 1;
        });
        console.log(`daily`, dailyUserStatus);
        res.send(dailyUserStatus);
    });
}

module.exports = { getMerchantsList, getDailyAppStatus };
