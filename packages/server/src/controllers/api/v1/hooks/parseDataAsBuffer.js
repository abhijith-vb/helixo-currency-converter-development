const bodyParser = require('body-parser');

module.exports = bodyParser.json({
    type: '*/*',
    limit: '50mb',
    verify: (req, res, buf) => {
        // console.log(req.url.indexOf('hooks'));
        if (req.url.indexOf('hooks')) {
            req.rawBody = buf;
            // console.log(`buf`, buf);
        }
    }
});
