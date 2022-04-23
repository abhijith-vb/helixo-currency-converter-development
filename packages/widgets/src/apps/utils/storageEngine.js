export const eStore = {
    set(key, val, storeType = 'session') {
        (storeType === 'session' ? sessionStorage : localStorage).setItem(key, JSON.stringify(val));
    },
    get(key, convertToJson = true, storeType = 'session') {
        const item = (storeType === 'session' ? sessionStorage : localStorage).getItem(key);
        return convertToJson ? JSON.parse(item) : item;
    },
    unset(key, storeType = 'session') {
        !Array.isArray(key) && (key = [key]);
        key.forEach(k => {
            (storeType === 'session' ? sessionStorage : localStorage).removeItem(k);
        });
    }
};
