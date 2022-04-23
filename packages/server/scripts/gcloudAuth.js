const shelljs = require('shelljs');
const dotenv = require('dotenv').config();

const gcloudAuth = () => {
    const { GCLOUD_AUTH_EMAIL, GCLOUD_PROJECT_NAME } = process.env;
    shelljs.exec(`gcloud config set account ${GCLOUD_AUTH_EMAIL} && gcloud config set project ${GCLOUD_PROJECT_NAME}`);
};

gcloudAuth();
