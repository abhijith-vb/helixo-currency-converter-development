module.exports = (req, res, next) => {
    try {
        const headerToken = req.get('X-BUCKSCC-AUTH');
        const { session } = req;

        if (!headerToken)
            return res.status(401).json({
                status: 'error',
                auth: false,
                error_type: 'NO_TOKEN',
                message: 'No token provided'
            });
        if (!session || !session.bucksccToken)
            return res.status(401).json({
                status: 'error',
                auth: false,
                error_type: 'NO_SESSION',
                message: 'Not a valid user'
            });
        if (headerToken !== session.bucksccToken)
            return res.status(401).json({
                staus: 'error',
                auth: false,
                error_type: 'TOKEN_MISMATCH',
                message: "Token can't be validated"
            });
        next();
    } catch (err) {
        res.status(401).json({
            status: 'error',
            auth: false,
            error_type: 'AUTH_FAILED',
            message: 'Authentication Failed'
        });
        console.log(err);
    }
};
