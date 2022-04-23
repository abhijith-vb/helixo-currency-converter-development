const shelljs = require('shelljs');
const dotenv = require('dotenv').config();
const { argv } = require('yargs');
const Ora = require('ora');
const chalk = require('chalk');

/**
 * Gcloud function to deploy production or STAGING based on commandline argument
 */
const gcloudDeploy = () => {
    // constants
    const PRODUCTION = 'PRODUCTION';

    // Gcloud env vars
    const { GCLOUD_PROJECT_NAME, GCLOUD_APP_NAME } = process.env;

    // get env and deploy type from commandline
    const { ENVIRONMENT, NODE_ENV = PRODUCTION, DELETE_OLD_CONTAINERS } = argv;

    const GCLOUD_LOCATION = 'us-central1';

    // Loading indicator
    const loaderOptions = { text: chalk.blue(`\n\nDeploying GCLOUD ${ENVIRONMENT} Version...\n\n`) };
    const processIndicator = new Ora(loaderOptions).start();

    // args checking
    if (!ENVIRONMENT) {
        console.error('Provide an --ENVIRONMENT argument value');
        return;
    }

    // if --ENVIRONMENT value is not either production or STAGING
    if (ENVIRONMENT && !['PRODUCTION', 'STAGING'].includes(ENVIRONMENT)) {
        console.error('--ENVIRONMENT value must be either "PRODUCTION" or "STAGING"');
        return;
    }

    // Gcloud command format
    const containerName = `${GCLOUD_APP_NAME}-${ENVIRONMENT === PRODUCTION ? 'prod' : 'stage'}`;

    // Gcloud deploy command
    const deployCommand = `gcloud builds submit --tag gcr.io/${GCLOUD_PROJECT_NAME}/${containerName} && gcloud beta run deploy ${containerName} --concurrency 80 --memory 512Mi --region ${GCLOUD_LOCATION} --platform managed --image gcr.io/${GCLOUD_PROJECT_NAME}/${containerName} --allow-unauthenticated --update-env-vars ENVIRONMENT=${ENVIRONMENT},NODE_ENV=${NODE_ENV}`;

    // delete containers command
    const deleteContainersCommand = `gcloud container images delete gcr.io/${GCLOUD_PROJECT_NAME}/${containerName}`;
    // execute the command
    if (DELETE_OLD_CONTAINERS === 'true' || DELETE_OLD_CONTAINERS === true) shelljs.exec(deleteContainersCommand);

    // execute deploy
    shelljs.exec(deployCommand);

    processIndicator.succeed(chalk.green(`\n\nDeployed GCLOUD ${ENVIRONMENT} Version successfully!\n\n`));
};

gcloudDeploy();
