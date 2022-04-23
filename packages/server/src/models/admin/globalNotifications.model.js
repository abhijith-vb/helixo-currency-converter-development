const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalNotifications = Schema({
    scope: { type: String, enum: ['global', 'user'] },
    shop: { type: String },
    message: { type: String },
    link: { type: String }
},
    { versionKey: false }
);

module.exports = mongoose.model('globalNotifications', globalNotifications);