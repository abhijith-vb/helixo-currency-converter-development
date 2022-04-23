import converter from "./converter";
import selectedCurrencyLocal from "../storage/selectedCurrency";
// convert all span.money
export default function doPageConvert(config, to) {
  selectedCurrencyLocal.set(to);
  console.log(`🔥 CONVERSION TAKES PLACE`);
  /* hxo$("span.money").each(function(elements) {
    const self = this;
    if (hxo$("span.money", this).length === 0) {
      converter(self, to, config);
      hxo$(self).addClass("buckscc-money");
    } else {
      console.log(`skip outer span.money`);
    }
  }); */
  const arr = (
    ((((window || {}).bucksCC || {}).config ||
    {}).priceSelector ||
    {}
  ).split(",");
  hxo$("arr").each(function(elements) {
    const self = this;
    if (hxo$(arr, this).length === 0) {
      converter(self, to, config);
      hxo$(self).addClass("buckscc-custom");
    } else {
      console.log(`skip`);
    }
  });
}
