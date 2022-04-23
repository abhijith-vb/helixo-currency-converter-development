/* eslint-disable no-console */
const User = require('../models/user.model');

/**
 * Function to save user details to DB
 * @param shop identifier to update data
 * @param data should contains property to update to DB
 */
const saveDetails = async (shop, data) =>
    // issue : pre not works with findOneAndUpdate
    // https://mongoosejs.com/docs/middleware.html#notes

    /**
  	$set used to set the values for updation 
  	$setOnInsert add values additional to $set on insertion
	  */
    new Promise((resolve, reject) => {
        const dataToUpdate = { ...data, last_used: Date.now() };
        delete dataToUpdate._id;
        const dataToInsert = { first_installed: Date.now() };
        // console.log('datatoupdate', dataToUpdate);
        User.findOneAndUpdate(
            { myshopify_domain: shop },
            { $set: dataToUpdate, $setOnInsert: dataToInsert, $inc: { access_count: 1 } },
            { useFindAndModify: false, upsert: true, returnNewDocument: true, new: true },
            (err, doc) => {
                console.log(`user data updated!`);
                if (err) {
                    console.log({ error: err });
                    reject(err);
                } else resolve(true);
            }
        );
    });

module.exports = { saveDetails };
