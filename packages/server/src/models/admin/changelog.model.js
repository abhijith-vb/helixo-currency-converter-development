const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const changelog = Schema({
    date: { type: Date, default: Date.now },
    version: { type: String },
    title: { type: String },
    description: { type: String }
},
    { versionKey: false }
);

module.exports = mongoose.model('changelog', changelog);