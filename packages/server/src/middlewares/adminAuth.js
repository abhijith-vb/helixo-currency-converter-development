/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const { ADMIN_STORES } = require(`../../config/env`);

module.exports = (req, res, next) => {
    function returnStatus(
        statusCode = 401,
        status = 'error',
        auth = 'false',
        error_type = 'AUTH_FAILED',
        message = 'Authentication Failed'
    ) {
        return res.status(statusCode).json({
            status,
            auth,
            error_type,
            message,
        });
    }
    try {
        const headerToken = req.get('X-UFE-AUTH');
        const { ufeToken, shop } = req.session;

        if (!headerToken) returnStatus(401, 'error', false, 'NO_TOKEN', 'No token provided');
        if (!ufeToken) returnStatus(401, 'error', false, 'NO_SESSION', 'Not a valid user');
        if (headerToken !== ufeToken) returnStatus(401, 'error', false, 'TOKEN_MISMATCH', "Token can't be validated");
        if (!ADMIN_STORES.includes(shop))
            returnStatus(401, 'error', false, 'ADMIN_MISMATCH', "Admin can't be validated");
        next();
    } catch (err) {
        returnStatus();
        console.log(err);
    }
};
