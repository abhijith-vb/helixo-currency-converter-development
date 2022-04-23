import { eStore } from '../../../utils/storageEngine';

const geoCurrency = {
    set: currency => {
        eStore.set('hxoGeoCurrency', currency);
    },
    get: () => eStore.get('hxoGeoCurrency')
};
export default geoCurrency;
