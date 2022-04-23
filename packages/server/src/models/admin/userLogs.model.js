const mongoose = require('mongoose');

const { Schema } = mongoose;

const userLogs = Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        shop: { type: String },
        date: { type: Date, default: Date.now },
        event: { type: String },
        value: { type: String },
    },
    { versionKey: false }
);

module.exports = mongoose.model('userLogs', userLogs);
