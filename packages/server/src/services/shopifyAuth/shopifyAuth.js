/* eslint-disable no-console */
const dotenv = require('dotenv').config();

const crypto = require('crypto');
const cookie = require('cookie');
const Nonce = require('nonce-fast');

const nonce = Nonce(9);
const querystring = require('querystring');
const request = require('axios');
const enableCookiesHtml = require('./enableCookies');

// let accessToken = '';

module.exports = function createShopifyAuthRoutes({ host, apiKey, secret, scopes, afterAuth, shopStore }) {
    return {
        auth(req, res) {
            const { baseUrl } = req;
            const { shop } = req.query;
            console.log('inside shopify auth url redirect');
            if (!shop) return res.status(400).send('Missing shop parameter, add ?shop=your-shop.myshopify.com');
            /* 
             Regex 
                [^ Negated set - Match any character that is not in the set.
                \w - Matches any word character (alphanumeric & underscore). Only matches low-ascii characters (no accented or non-roman characters). Equivalent to [A-Za-z0-9_]
                \s - Matches any whitespace character (spaces, tabs, line breaks).
                . - Matches a . escaped character
                \- - Matches a - escaped character
            */
            if (/[^\w\s.!\-?]/g.test(shop)) return res.status(400).send("Oof! That's not a valid shop");
            const state = nonce();
            const redirectUrl = `${host}${baseUrl}/callback`;
            const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUrl}`;

            res.cookie(`__session`, state, { path: '/api/auth', sameSite: 'none', secure: true, httpOnly: true });
            res.setHeader('Cache-Control', 'private');
            res.redirect(installUrl);
        },
        async callback(req, res, next) {
            try {
                // Check if the request is coming from safari
                const { IS_FUCKING_SAFARI } = req;
                console.log(`inside callback`);
                const { shop, hmac, code, state } = req.query;
                const stateCookie = req.headers.cookie ? cookie.parse(req.headers.cookie).__session : '';
                if (state !== stateCookie && !IS_FUCKING_SAFARI) {
                    const cookieHtml = enableCookiesHtml(shop, apiKey);
                    res.clearCookie('__session', { path: '/' });
                    res.clearCookie('__session', { path: '/api/auth' });
                    return res.send(cookieHtml);
                    // return res.status(403).send('Request origin cannot be verified');
                }

                if (shop && hmac && code) {
                    const map = { ...req.query };
                    delete map.hmac;
                    const message = querystring.stringify(map);
                    const generatedHash = crypto
                        .createHmac('sha256', secret)
                        .update(message)
                        .digest('hex');

                    if (generatedHash !== hmac) {
                        return res.status(400).send('Hmac Validation Failed');
                    }
                    // Exchange temporary code for a permanent access token
                    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
                    const accessTokenPayload = {
                        client_id: apiKey,
                        client_secret: secret,
                        code
                    };
                    try {
                        let accessTokenResponse = await request.post(accessTokenRequestUrl, accessTokenPayload);
                        accessTokenResponse = accessTokenResponse.data;
                        const accessToken = accessTokenResponse.access_token;
                        console.log(`accesstoken`, accessTokenResponse);
                        if (req.session) {
                            req.session.accessToken = accessToken;
                            req.session.shop = shop;
                            console.log('session set');
                        } else {
                            console.warn('Session not present on request, please install a session middleware.');
                        }
                    } catch (error) {
                        console.log('error from shopify auth', error);
                        res.status(401).send('Error while authentication');
                    }
                    // Things to do after auth
                    afterAuth(req, res);
                    console.log(`before afterShopifyAuth`);
                } else {
                    res.status(400).send('Required parameters missing');
                }
            } catch (err) {
                console.log(`shopify auth error`, err);
                res.status(401).send('Error on authentication');
            }
        }
    };
};
