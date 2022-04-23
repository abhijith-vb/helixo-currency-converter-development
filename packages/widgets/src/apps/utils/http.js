/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { API_DOMAIN } from '@buckscc/common';
import { encodedShopUrl } from './shopifyFunctions';

export function post(url, data) {
    return new Promise((resolve, reject) => {
        const sendData = {
            data,
            auth: encodedShopUrl
        };
        as$.post(`${API_DOMAIN}${url}`, sendData, res => {
            resolve(res);
        }).fail(err => {
            reject(err);
            console.log(`Something went wrong!`);
        });
    });
}
