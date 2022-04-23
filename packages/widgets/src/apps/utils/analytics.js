/* eslint-disable no-console */
import { post } from './http';

export const sendAnalytics = (event, value = true, cB = () => {}) => {
    const { isMerchant } = window.buckscc;
    !isMerchant &&
        post('analytics', { event, value }, () => {
            // Callback after solving the request
            cB();
            console.log(`Analytics Logged!`);
        });
};
