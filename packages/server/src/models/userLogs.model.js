const mongoose = require('mongoose');

const userLogsSchema = mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    shop: { type: String },
    event: { type: String },
    value: { type: String },
    rawData: { type: String }
}, { versionKey: false })

module.exports = mongoose.model('UserLogs', userLogsSchema);
