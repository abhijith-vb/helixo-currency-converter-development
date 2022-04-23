/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
const validateJson = json => {
    let checkedJson;
    try {
        checkedJson = JSON.parse(json);
    } catch (error) { }
    return checkedJson;
};
export default validateJson;
