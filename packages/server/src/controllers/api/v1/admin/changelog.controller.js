const Changelog = require('../../models/admin/changelog.model');

exports.saveChangelog = (req, res) => {
    const changelogContent = req.body;
    Changelog.create(changelogContent)
    .then(docs => {
        res.status(200).json({
            status: "success",
            message: "Changelog is saved successfully."
        })
    })
    .catch(err => {
        res.status(404).json({
            status: "error",
            message: "Error while saving changelog."
        })
    })
}