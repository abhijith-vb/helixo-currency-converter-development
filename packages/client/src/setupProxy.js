const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/pages', { target: 'http://localhost:4001/' }));
    app.use(proxy('/app', { target: 'http://localhost:4001/' }));
    app.use(proxy('/scripts', { target: 'http://localhost:4001/' }));
    app.use(proxy('/graphql', { target: 'http://localhost:4001/' }));
    app.use(proxy('/api', { target: 'http://localhost:4001/' }));

};