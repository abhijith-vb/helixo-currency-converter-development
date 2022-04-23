const { GraphQLClient } = require('graphql-request');

exports.getProducts = (req, res) => {
    const { shop } = req.session;
    if (!shop) return res.status(404).send('Auth Failed!');
    console.log(req.session);
    const client = new GraphQLClient(`https://${shop}/admin/api/2019-04/graphql.json`, {
        headers: {
            'X-Shopify-Access-Token': (req.session && req.session.accessToken) || '',
            'Content-Type': 'application/json'
        }
    });
    // console.log(req.body.query);
    const { query } = req.body;
    // request(`https://${shop}.myshopify.com/admin/api/2019-04/graphql.json`, query).then(data => console.log(data))
    // console.time('graphql');
    client
        .request(query)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ status: 'error', message: 'Error in fetching products' });
        });
};
