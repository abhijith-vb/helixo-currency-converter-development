import { eStore } from '../../../utils/storageEngine';

const currencyRates = {
    set: rates => {
        const today = new Date().toISOString().split('T')[0];
        const payload = {
            currencyRateToday: rates,
            today
        };
        eStore.set('bucksccConversionRates', payload);
    },
    get: () => {
        const today = new Date().toISOString().split('T')[0];
        const localCurrencyRates = eStore.get('bucksccConversionRates');
        if (localCurrencyRates && localCurrencyRates.today === today) {
            return localCurrencyRates.currencyRateToday;
        }
        return null;
    }
};

export default currencyRates;
