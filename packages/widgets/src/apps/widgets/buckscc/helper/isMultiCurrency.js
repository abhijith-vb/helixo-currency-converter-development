const isMUltiCurrency = (config, currentCurrency) => {
    if (
        config.multiCurrencyEnabled &&
        config.multiCurrencies &&
        config.multiCurrencies.length > 1 &&
        config.multiCurrencies.includes(currentCurrency) &&
        config.userCurrency !== currentCurrency
    ) {
        return true;
    }
    return false;
};
export default isMUltiCurrency;
