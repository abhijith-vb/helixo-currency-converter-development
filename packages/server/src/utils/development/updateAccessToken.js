const fs = require('fs');
const path = require('path');

/**
 * Overwrite the accesstoken in accessToken.js file for development purpose
 * @param {String} accessToken shopify accesstoken
 */
const updateAccessToken = accessToken => {
    const dateWithTime = new Date();
    const accessTokenUpdateFileContent = `/**
 * This file contains the fake accessToken data to be set to the session for development purpose
 * LAST UPDATED: ${dateWithTime}
 */

module.exports = '${accessToken}';
`;

    fs.writeFile(path.join(`${__dirname}/../../config/accessToken.js`), accessTokenUpdateFileContent, (err, res) => {
        if (err) console.log(`DEVELOPMENT: Error updating AccessToken in the File!`);
        console.log(`DEVELOPMENT: New AccessToken Update in the File!`);
    });
};

module.exports = updateAccessToken;
