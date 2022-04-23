export const sort = (list, property) => ([...list.sort((a, b) => (a[property] > b[property]) ? 1 : -1)]);

// create as a common fn.
export const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };
};
export const cleanup =()=>{
    console.log('in clean up');
    const { $crisp = {} } = window;
                if (typeof $crisp.push === 'function'){
                    console.log('crisp session reset');
                    $crisp.push(["do", "session:reset"]) 
                }
}

export const uuId = (length = 10) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const capitalize = (word) => {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
};

/* Check if an object is empty */
export const isEmpty = (a) => a ? Object.keys(a || {}).length === 0 : true;

/* 
* 
* Instead of doing this
*   - Obj && Obj.funnel && Obj.funnel.trigger && Obj.funnel.trigger.product && {}
* Call this
*   - Obj(Obj, 'Obj.funnel.trigger.product') returns the values of Obj.funnel.trigger.product if not empty 
*     otherwise return false
*/
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
    // return (needEmptyArray && (result == null)) ? [] : ((Array.isArray(result) && result.length === 0) && !needEmptyArray) ? null : result;
    // console.log('res', JSON.stringify(result) );
    // return result ? (defaultValue ? ((Array.isArray(result) && result.length === 0) ? defaultValue : result) : true) : defaultValue;
    return result || result === 0 ? (
        (Array.isArray(result) && result.length === 0)
            ? defaultValue : (
                defaultValue !== null ? result : true
            )
    ) : defaultValue;
}
export const formatCurrency = (format, money) => ((format || '').replace(/(<([^>]+)>)/ig, '')).replace(/({{([^}]+)}})/ig, money.toFixed(2))

export const storageEngine = {
    // TODO: whether to need null check
    set(key, val) {
        // JSON Safe error check before save, check if the value is boolean or falsy value then don't stringify
        let valueToSave = val;
        try {
            // Sometimes true and false values comes as string, so we are trying to parse it as boolean, if err just skips this
            valueToSave = typeof val === 'string' ? JSON.parse(val) : val;
        } catch (err) { }

        // if the valueToSave is a boolean or falsy values don't stringify, store it
        valueToSave = typeof valueToSave === 'boolean' || !valueToSave ? valueToSave : JSON.stringify(valueToSave);
        localStorage.setItem(key, valueToSave);
    },
    get(key, convertToJson = true) {
        const item = localStorage.getItem(key);
        // JSON Safe error check before retrieving
        let returnItem = item;
        try {
            returnItem = convertToJson ? JSON.parse(item) : item;
        } catch (err) { returnItem = false }
        return returnItem;
    },
    unset(key) {
        !Array.isArray(key) && (key = [key]);
        key.forEach(k => {
            localStorage.removeItem(k);
        });
    },
};

/**
 * clone an object or array.
 * @param {*} input can be array or object
 */
export const deepClone = (input) => (JSON.parse(JSON.stringify(input || {})));

export const isSubArray = (master, sub) =>
    !sub.find((each) =>
        !master.find((every) => every === each)
    )

export const validateUser = (plan) => plan && !(plan.match(/^(affiliate|partner_test|staff_business|staff|shopify_plus|trial)$/))
