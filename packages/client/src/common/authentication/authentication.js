import http from '../http/httpProvider';
import { storageEngine } from '../helper/commonMethods';

export const authenticateUser = () => {
    const userData = storageEngine.get('user') || {};
    return (userData.isAuthenticated && userData.token) || true;
};

export const getToken = () => {
    const userData = storageEngine.get('user') || {};
    return userData.token;
};

export const getUser = (token, fn) => {
    const isEmpty = (a) => Object.keys(a).length === 0;
    http.getAction('api/v1/user').then((user = {}) => {
        const data = {
            ...user.data,
            token: token,
            isAuthenticated: false
        };
        if (!isEmpty(data) && data.shop_owner) {
            // encode to base 64 and save
            data.token = token;
            data.isAuthenticated = true;
            storageEngine.set('user', data);
            console.log(`Inside User data get success`);
            fn(data);
        } else {
            console.log(`Inside User data empty`);
            storageEngine.set('user', data);
            fn(false);
        }
    }).catch(e => {
        // const user = {
        //     token: token,
        //     isAuthenticated: false
        // };
        // console.log(`Catch block of user req`);
        // storageEngine.set('user', user);
        fn(false);
    });
};
