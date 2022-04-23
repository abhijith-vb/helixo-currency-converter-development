const fetch = require('node-fetch');
const Settings = require('../../../../models/settings.model');

/**
 * Get details of app from DB
 */
const getCurrencies = async (req, res, next) => {
    try {
        const CURRENCY_URL = 'https://buckscc-demo.myshopify.com/services/javascripts/currencies.js';
        fetch(CURRENCY_URL, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
            }
        })
            .then(response => response.text())
            .then(docs => {
                res.send(docs);
            });
    } catch (err) {
        console.log(`error`, err);
        res.sendStatus(404);
    }
};

const getConfig = async (req, res) => {
    try {
        const { shop } = req.body;
        const details = (await Settings.findOne({ shop }, '-_id -shop').lean()) || {};
        res.json(details);
    } catch (error) {
        console.log(`Error getting config`, error);
        res.status(404);
    }
};

module.exports = { getCurrencies, getConfig };
