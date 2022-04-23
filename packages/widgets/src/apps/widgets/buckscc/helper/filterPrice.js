/* eslint-disable no-useless-escape */
import getFloatingPoints from './getFloatingPoints';
import currencyFormats from '../common/currencyFormats';

const Filterprice = (content, moneyFormat, toCurrency, userCurrency) => {
    let refinedContent = content;
    const regExToRemoveAmount = /\{\{\s*(\w+)\s*\}\}/;
    const regExToRemoveHtmlTags = /<((?!<)(.|\n))*?\>/g;
    const removable = moneyFormat
        .replace(regExToRemoveHtmlTags, ' ')
        .replace(regExToRemoveAmount, ' ')
        .split(' ');
    removable.forEach(item => {
        refinedContent = refinedContent.replace(item, '');
    });

    // for currencies with different delimiter and separator like euro

    if (moneyFormat && moneyFormat.includes('comma_separator')) {
        refinedContent = refinedContent.replace(/\./g, '').replace(/,/g, '.');
    } else if (moneyFormat && moneyFormat.includes('amount_no_decimals') && refinedContent.includes(' ')) {
        refinedContent = refinedContent.replace(/ /g, '');
    }
    return parseFloat(refinedContent.replace(/,/g, '')).toFixed(
        getFloatingPoints(bucksCC.config.userCurrency, bucksCC.config)
    );
};

export default Filterprice;
