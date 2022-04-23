const express = require('express');

const graphql = express.Router();
const graphqlController = require('./graphql.controller');

graphql.post('/', graphqlController.getProducts);

module.exports = graphql;
