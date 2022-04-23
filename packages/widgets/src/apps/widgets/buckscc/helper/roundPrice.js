export default function roundPrice(price, config) {
    const intPrice = Math.round(price);
    const newprice =
        +config.roundingDecimal > +0.5 ? intPrice - (1 - +config.roundingDecimal) : intPrice + +config.roundingDecimal;

    // auto round to .49 or 99
    // newprice = Number(newprice) > 0.25 ? Math.round(newprice * 2) / 2 - 0.01 : 0.49;
    return newprice > 0 ? newprice : price;
}
