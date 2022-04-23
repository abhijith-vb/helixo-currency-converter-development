const User = require('../../models/user.model');

const saveUserDetailsToDB = async data => {
    /* *
	! @param data should have myshopify_domain
  	$set used to set the values for updation 
  	$setOnInsert add values additional to $set on insertion
  	*/
    const dataToUpdate = { ...data, last_used: Date.now() };
    delete dataToUpdate._id;
    const dataToInsert = { first_installed: Date.now() };
    // console.log('datatoupdate', dataToUpdate);
    User.findOneAndUpdate(
        { myshopify_domain: data.myshopify_domain },
        { $set: dataToUpdate, $setOnInsert: dataToInsert, $inc: { access_count: 1 } },
        // Default values are inserted only with insert inorder to use it for updation add setDefaultsOnInsert: true
        { useFindAndModify: false, setDefaultsOnInsert: true, upsert: true, returnNewDocument: true, new: true },
        (err, doc) => {
            console.log(`user data updated!`);
            if (err) console.log({ error: err });
            else return true;
        }
    );
};

module.exports = saveUserDetailsToDB;
