const mongoose = require('mongoose');

const suggestFeature = mongoose.Schema({
    title: { type: String },
    description: { type: String },
    upvotes: { type: Number },
    downvotes: { type: Number }
}, { versionKey: false })

module.exports = mongoose.model("suggestFeature", suggestFeature);