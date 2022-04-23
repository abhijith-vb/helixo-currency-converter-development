/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import currencyFormats from '../common/currencyFormats';
import moneyFormatter from '../helper/moneyFormatter';
import Filterprice from '../helper/filterPrice';
import roundPrice from '../helper/roundPrice';
import isUserSelectedCurrency from '../helper/isUserSelectedCurrency';
import selectedCurrencyLocal from '../storage/selectedCurrency';

const appConverter = (
    value,
    to = selectedCurrencyLocal.get(),
    from = bucksCC.config.cartCurrency,
    moneyFormat = bucksCC.config.baseMoneyFormat
) => {
    if (isUserSelectedCurrency(bucksCC.config, to)) {
        const val = isNaN(value) ? Filterprice(value, moneyFormat, to, bucksCC.config.userCurrency) : value;

        let newprice = bucksCC.Currency.convert(val, from, to);
        if (!isNaN(newprice)) {
            // 2 floating points format with comma separators
            // if (bucksCC.config.roundPriceStatus || bucksCC.priceRoundingType === 'roundToDecimal') {
            if (bucksCC.priceRoundingType === 'roundToDecimal') {
                roundPrice(bucksCC.config, newprice);
            }

            let newFormat;
            if (bucksCC.config.moneyWithCurrencyFormat) {
                newFormat = currencyFormats[to].money_with_currency_format || '{{amount}}';
            } else {
                newFormat = currencyFormats[to].money_format || '{{amount}}';
            }
            const formatType = newFormat
                .split('{{')
                .pop()
                .split('}}')[0]; // returns 'amount','amount_no_decimals_with_comma_separator' etc

            const formattedMOney = moneyFormatter(newprice, formatType, to, bucksCC.config);
            newprice = newFormat.replace(`{{${formatType}}}`, formattedMOney);
        }

        return newprice;
    }
    return value;
};
export default appConverter;
