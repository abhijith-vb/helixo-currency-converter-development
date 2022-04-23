const crypto = require('crypto');
const { SHOPIFY_API_SECRET } = require('../config/env');

module.exports = (req, res, next) => {
    const hmac = req.get('x-shopify-hmac-sha256');
    const shop = req.get('x-shopify-shop-domain');
    const hook = req.get('x-shopify-topic');
    // let data = req.body;
    // const data = JSON.stringify(req.body);
    // console.log(req.rawBody);
    // data.replace(/\//g, '\\/');
    const data = req.rawBody;
    const generatedHash = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET)
        .update(data, 'utf8')
        .digest('base64');
    if (hmac !== generatedHash)
        return res.status(401).json({
            status: 'error'
        });
    next();

    // const message = querystring.stringify(map);
};
