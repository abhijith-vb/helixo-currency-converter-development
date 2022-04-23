export default function getFloatingPoints(curr, config) {
    if (config.priceRoundingType === 'removeDecimal') return 0;
    let decimal = 2;
    const exceptions = ['KWD', 'JOD', 'OMR', 'BHD'];
    if (exceptions.includes(curr)) {
        decimal = 3;
    } else if (curr === 'BTC') {
        decimal = 8;
    }
    return decimal;
}
