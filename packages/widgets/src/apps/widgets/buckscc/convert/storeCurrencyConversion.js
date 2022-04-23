import showUpdatedPrice from './showUpdatedPrice';
import getpriceFromelement from './getpriceFromelement';
import roundPrice from '../helper/roundPrice';
import moneyFormatter from '../helper/moneyFormatter';
import currencyFormats from '../common/currencyFormats';
import clearAllDataValues from '../helper/clearAllDataValues';

function storeCurrencyConversion(
    self,
    config,
    childrenExists,
    originalItemPrice,
    initVal,
    currentValue,
    previousValue
) {
    if (config.defaultCurrencyRounding && (config.multiCurrencies || []).length <= 1) {
        let price;
        if (originalItemPrice && hxo$(self).hasClass('buckscc-money')) {
            price = initVal;
            
            hxo$(self).data(`buckscc-currentCurrency`, `${config.cartCurrency}`);
        } else {
            price = getpriceFromelement(childrenExists, self, config, config.baseCurrency);
        }
        // if (config.roundPriceStatus || config.priceRoundingType === 'roundToDecimal') {
        if (config.priceRoundingType === 'roundToDecimal') {
            price = roundPrice(price, config);
        }
        let newFormat;
        if (config.moneyWithCurrencyFormat) {
            newFormat = config.money_with_currency_format || '{{amount}}';
            // newprice = newFormat.replace("{{amount}}", newprice);
        } else {
            newFormat = config.money_format || '{{amount}}';
        }
        const formatType = newFormat
            .split('{{')
            .pop()
            .split('}}')[0]; // returns 'amount','amount_no_decimals_with_comma_separator' etc
        const formattedMOney = moneyFormatter(price, formatType, config.baseCurrency, config);
        price = newFormat.replace(`{{${formatType}}}`, formattedMOney);
        showUpdatedPrice(childrenExists, self, price);
    } else if (originalItemPrice && currentValue === previousValue) {
        // clearAllDataValues(self);
        hxo$(self).data(`buckscc-currentCurrency`, `${config.cartCurrency}`);
        showUpdatedPrice(childrenExists, self, originalItemPrice);
    } else {
        clearAllDataValues(self);
    }
}
export default storeCurrencyConversion;
