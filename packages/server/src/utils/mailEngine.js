/* eslint-disable camelcase */
const request = require('node-fetch');
const uuid = require('uuid/v4');
const dayjs = require('dayjs');
const config = require('../config/env');
// const Promo = require('../models/promo.model');

const { SENDINBLUE_API_KEY } = process.env;

/**
 * Send request to sendinblue servers
 * @param endpoint url endpoint of sendinblue api,
 * NOTE: Only specify the endpoint not the full sendinblue url
 *  Eg: pass endpoint as 'contact' instead 'https://api.sendinblue.com/v3/contact'
 * @param data data to be passed to endpoint
 */
function sendRequest(endpoint, data, successMsg = 'Successfully submitted! ', ErrorMsg = 'Error from SendInBlue: ') {
    const reqUrl = `https://api.sendinblue.com/v3/${endpoint}`;
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': SENDINBLUE_API_KEY
        },
        body: JSON.stringify(data)
    };

    request(reqUrl, options)
        .then(body => body.json())
        .then(body => {
            console.log(`${successMsg} => `, body);
        })
        .catch(error => {
            console.log(`${ErrorMsg}=>`, error);
        });
}

const sendUninstallTransactionalMail = async customerData => {
    const {
        TEMPLATES: { UNINSTALL_TEMPLATE_ID },
        SUPPORT_MAIL,
        SUPPORT_AGENT_NAME
    } = config.MAIL;
    const { email, shop_owner, myshopify_domain } = customerData;
    const shopUUID = uuid();
    const expiry_time = dayjs().add('5', 'day'); // 5 Days
    // Save UUID to Database
    // Promo.create({ tempUUID: shopUUID, myshopify_domain, expireAt: expiry_time })
    //     .then(res => {
    //         console.log(`uuid updated`);
    //     })
    //     .catch(err => {
    //         console.log(`error`, err);
    //     });

    // Generate reinstall link
    // ? In sendinblue, we use {{REINSTALL_LINK}} as the href so, it adds https:// by default
    const cleanedHost = (config.host || '').replace('https://', '');
    const reinstall_link = `${cleanedHost}/api/promo/reinstall?token=${shopUUID}&shop=${myshopify_domain}`;
    const sendData = {
        sender: {
            email: SUPPORT_MAIL,
            name: `${SUPPORT_AGENT_NAME} - Support @Helixo Co`
        },
        to: [
            {
                email,
                name: shop_owner
            }
        ],
        replyTo: {
            email: SUPPORT_MAIL
        },
        params: {
            FIRSTNAME: shop_owner,
            EMAIL: email,
            SHOP: myshopify_domain,
            REINSTALL_LINK: reinstall_link
        },
        // UNINSTALL_TEMPLATE_ID MUST BE AN INTEGER
        templateId: +UNINSTALL_TEMPLATE_ID,
        tags: ['uninstall_event']
    };
    // console.log(`inside uninstall`, sendData);
    if (process.env.environment !== 'DEVELOPMENT')
        sendRequest('smtp/email', sendData, 'CEO Mail for Uninstall Event Sent!');
};

const createContact = async customerData => {
    const { email, phone, shop_owner } = customerData;
    const contactData = {
        email,
        attributes: {
            SMS: phone,
            FIRSTNAME: shop_owner
        },
        emailBlacklisted: false,
        smsBlacklisted: false,
        updateEnabled: false
    };
    sendRequest('contacts', contactData, 'Contact Created!');
};

module.exports = { createContact, sendUninstallTransactionalMail };
