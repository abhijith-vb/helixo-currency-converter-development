const isUserSelectedCurrency = (config, currenctCurrency) => {
    const { selectedCurrencies } = config;
    let isSelected = false;
    selectedCurrencies.forEach(c => {
        if (Object.keys(c)[0] === currenctCurrency) isSelected = true;
    });
    return isSelected || !config.autoSwitchOnlyToPreferredCurrency;
};
export default isUserSelectedCurrency;
