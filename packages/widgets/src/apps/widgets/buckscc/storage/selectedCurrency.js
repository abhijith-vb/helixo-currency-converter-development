import { eStore } from '../../../utils/storageEngine';

const currencySaved = {
    set: currency => {
        eStore.set('buckscc_customer_currency', currency);
    },
    get: () => eStore.get('buckscc_customer_currency')
};
export default currencySaved;
