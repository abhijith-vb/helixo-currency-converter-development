/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/**
 * This file call exports based on the env passed via cli
 * @param development build development bundle to app-scripts/dist/apps/merchant_script.bundle.js
 * @param production build production bundle and copy the production bundle to server/dist/scripts/merchant_script.bundle.js
 *
 * ? npm run build:prod - builds and copy bundle file to server/dist
 */

module.exports = env => require(`./webpack.${env}.js`);
