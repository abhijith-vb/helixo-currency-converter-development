/* eslint-disable no-restricted-globals */
import currencyFormats from '../common/currencyFormats';
import moneyFormatter from '../helper/moneyFormatter';
import roundPrice from '../helper/roundPrice';
import showUpdatedPrice from './showUpdatedPrice';
import getpriceFromelement from './getpriceFromelement';
import storeCurrencyConversion from './storeCurrencyConversion';
import clearAllDataValues from '../helper/clearAllDataValues';


const converter = (self, to, config) => {
    const originalItemPrice = hxo$(self).data('buckscc-originalPrice');
    const initVal = hxo$(self).data('buckscc-initVal') || '';
    const childrenExists = !!hxo$(self).children().length;
    const currentValue = getpriceFromelement(childrenExists, self, config, to, true) || '';
    const previousValue = hxo$(self).data('buckscc-currentVal') || '';
    const currentCurrency = hxo$(self).data('buckscc-currentCurrency') || '';
    let newprice;
    if (previousValue === currentValue && currentValue !== '' && currentCurrency === to ) {
        console.log('No changes... return');
    } else {
        if (to === config.cartCurrency && currentCurrency && currentCurrency !== to ) {
            // dont convert if target currency is store currency

            storeCurrencyConversion(
                self,
                config,
                childrenExists,
                originalItemPrice,
                initVal,
                currentValue,
                previousValue
            );
            return;
        } else if(to === config.cartCurrency && currentCurrency && currentCurrency === to ){
            // if store currency or cart currency conversion with span money and wrapper not updating- then clear all data vals
            clearAllDataValues();
            return;
        }

        // check if already done coversion on this
        if (initVal && hxo$(self).hasClass('buckscc-money') && previousValue === currentValue) {
            const convertedPrice = hxo$(self).data(to);

            if (convertedPrice && !isNaN(convertedPrice)) {
                newprice = convertedPrice;
            } else if (currentCurrency !== to) {
                newprice = bucksCC.Currency.convert(initVal, config.baseCurrency, to);
                hxo$(self).data(`${to}`, `${newprice}`);
            }
        } else {
            if(!currentCurrency && config.baseCurrency === to) return;
            const val = getpriceFromelement(childrenExists, self, config, to);
            newprice = bucksCC.Currency.convert(val, config.baseCurrency, to);
        }
        if (!isNaN(newprice)) {
            // round price to .49 or .99
            // if (config.roundPriceStatus || config.priceRoundingType === 'roundToDecimal') {
            if (config.priceRoundingType === 'roundToDecimal') {
                newprice = roundPrice(newprice, config);
            }

            let newFormat;
            if (config.moneyWithCurrencyFormat) {
                newFormat = currencyFormats[to].money_with_currency_format || '{{amount}}';
                // newprice = newFormat.replace("{{amount}}", newprice);
            } else {
                newFormat = currencyFormats[to].money_format || '{{amount}}';
            }
            const formatType = newFormat
                .split('{{')
                .pop()
                .split('}}')[0]; // returns 'amount','amount_no_decimals_with_comma_separator' etc
            const formattedMoney = moneyFormatter(newprice, formatType, to, config);
            newprice = newFormat.replace(`{{${formatType}}}`, formattedMoney);

           
            hxo$(self).data(`buckscc-currentCurrency`, `${to}`);
            showUpdatedPrice(childrenExists, self, newprice);
        }
    }
};

export default converter; 
