const fetch = require('node-fetch');

const config = require(`../config/env`);

const BOT_URL = config.DISCORD_BOT_HOST;

function sendToBOT(logData) {
    // console.log(`logdata`, logData);
    fetch(`${BOT_URL}/ping`, {
        method: 'POST',
        body: JSON.stringify(logData)
    })
        .then(docs => {
            console.log(`Sent activity to BOT`);
        })
        .catch(err => {
            console.log(`Error from BOT: `);
        });
}

exports.sendEvent = async function(logMsg) {
    const logData = {
        type: 'event',
        event: logMsg
    };
    sendToBOT(logData);
};

exports.sendError = async function(logData) {
    logData.type = 'error';
    logData.error = logData.error.stack;
    sendToBOT(logData);
};
