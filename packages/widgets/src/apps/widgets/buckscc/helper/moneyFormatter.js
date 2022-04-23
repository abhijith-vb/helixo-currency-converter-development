/* eslint-disable no-restricted-globals */
import getFloatingPoints from './getFloatingPoints';

// format each currency with corresponding separator and delimeter
const moneyFormatter = (price, formatType, toCurrency, config) => {
    function displayDelims(num, precision = 2, thousandsDelimiter = ',', decimal = '.') {
        let amount = num;
        if (isNaN(amount) || amount == null) {
            return 0;
        }
        amount = Number(amount).toFixed(precision);
        const parts = amount.split('.');
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousandsDelimiter}`);
        const cents = parts[1] ? decimal + parts[1] : '';
        return dollars + cents;
    }

    let val = '';
    const precisionPoints = getFloatingPoints(toCurrency, config);

    switch (formatType) {
        case 'amount':
            val = displayDelims(price, precisionPoints);
            break;
        case 'amount_no_decimals':
            val = displayDelims(price, 0);
            break;
        case 'amount_no_decimals_with_comma_separator':
            val = displayDelims(price, 0, '.', ',');
            break;
        case 'amount_with_comma_separator':
            val = displayDelims(price, precisionPoints, '.', ',');
            break;
        default:
            val = displayDelims(price, precisionPoints, ',', '.');
    }
    return val;
};
export default moneyFormatter;
