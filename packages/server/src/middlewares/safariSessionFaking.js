/**
 * This middleware will deal with the safari third-party cookie not sending issue
 * This middleware get and extracts the sessionID from the X-BUCKSCC-AUTH and assign it to req.cookies['connect.sid]
 */
module.exports = (req, res, next) => {
    try {
        const { IS_FUCKING_SAFARI } = req;
        const headerToken = req.get('X-BUCKSCC-AUTH');

        // Check if the request is coming from safari and the header token is present then set create a session
        if (IS_FUCKING_SAFARI && headerToken) {
            // extract session id from header token
            const sessionId = (headerToken || '').split('.')[0];

            // get the session entry with sessionId and create session and attach to the store
            if (req.sessionStore) {
                req.sessionStore.get(sessionId, function(err, sess) {
                    // This attaches the session to the req.
                    req.sessionStore.createSession(req, sess);
                    next();
                });
            } else next();
        } else next();
    } catch (err) {
        console.log(err);
    }
};
