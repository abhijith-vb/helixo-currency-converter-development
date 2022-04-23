export const getIt = (obj, key, defaultValue = null) => {
    if (!obj) {
        return defaultValue
    }
    const result = key.split(".").reduce((o, x) => {
        /* If a exists then checking a[b] exists or a[b] equals zero, because in some cases the value will be 0 which not equals false, but javascript treats it as false */
        return (o && (o[x] || o[x] === 0)) ? o[x] : null;
    }, obj);

    /* 
    * If (result is null and emptyArray needed) then 
    *       return [] 
    *   otherwise (result is empty array and emptyArray is not needed) then 
    *       return null
    *   otherwise return result
     */
    return result || result === 0 ? (
        (Array.isArray(result) && result.length === 0)
            ? defaultValue : (
                defaultValue !== null ? result : true
            )
    ) : defaultValue;
}