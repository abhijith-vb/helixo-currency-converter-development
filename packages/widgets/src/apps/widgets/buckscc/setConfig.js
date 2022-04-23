/* eslint-disable camelcase */
import validateJson from "./helper/validateJson";
import currencyFormats from "./common/currencyFormats";
import { isThankyouPage, isOrderPage } from "../../utils/isPageType";

export default function setConfig(storeConfig, isRerender = false) {
  /**
   * set shop and cart currencies for thankyou page from shopify global var
   */
  if (
    window.location.href.includes("/thank_you") ||
    window.location.href.includes("/orders")
  ) {
    const {
      total_price_set: { presentment_money = {}, shop_money = {} },
    } = Shopify.checkout || {};
    storeConfig.userCurrency = (shop_money && shop_money.currency_code) || {};
    storeConfig.cartCurrency =
      (presentment_money && presentment_money.currency_code) || {};
    const currency = storeConfig.cartCurrency
      ? storeConfig.cartCurrency
      : storeConfig.userCurrency;
    storeConfig.money_format = currencyFormats[currency].money_format;
    storeConfig.money_with_currency_format =
      currencyFormats[currency].money_with_currency_format;
  }

  const defaultConfig = {
    id: null,
    active: false,
    demoMode: false,
    userCurrency: "USD",
    // eslint-disable-next-line no-template-curly-in-string
    money_format: "<span class=money>${{amount}} USD</span>",
    selectedCurrencies: [
      { USD: "US Dollar (USD)" },
      { EUR: "Euro (EUR)" },
      { GBP: "British Pound (GBP)" },
      { CAD: "Canadian Dollar (CAD)" },
      { AFN: "Afghan Afghani (AFN)" },
      { ALL: "Albanian Lek (ALL)" },
      { INR: "Indian Rupee" },
    ],
    autoSwitchCurrencyLocationBased: true,
    autoSwitchOnlyToPreferredCurrency: false,
    showAutoLocationEntry: true,
    showCurrencyCodesOnly: false,
    multiCurrencyForceReload: true,
    reloadPending: false,
    moneyWithCurrencyFormat: true,
    displayPositionType: "floating",
    displayPosition: "bottom_left",
    floatingPositionOnThankyouPage: true,
    positionPlacement: "append",
    mobilePositionPlacement: "append",
    customPosition: 'header a[href*="/cart"]',
    customOptionsPlacement: false,
    optionsPlacementType: "left_upwards",
    customOptionsPlacementMobile: false,
    optionsPlacementTypeMobile: "left_upwards",
    borderStyle: "boxShadow",
    showInDesktop: true,
    showInMobileDevice: true,
    showOriginalPriceOnMouseHover: true,
    showConvertedMultiCurrency: false,
    cartNotificationStatus: true,
    cartNotificationMessage:
      "We process all orders in {STORE_CURRENCY} and you will be checkout using the most current exchange rates.",
    cartNotificationBackgroundColor: "#cce5ff",
    cartNotificationTextColor: "#004085",
    roundPriceStatus: true,
    roundingDecimal: 0.99,
    priceRoundingType: "roundToDecimal",
    defaultCurrencyRounding: false,
    integreteWithOtherApps: true,
    themeType: "modernLayered",
    flagTheme: "circle",
    flagStyle: "modern",
    flagDisplayOption: "showFlagAndCurrency",
    hideCurrencySelector: false,
    backgroundColor: "#fff",
    textColor: "#333",
    hoverColor: "#ccc",
    darkMode: false,
    target: "body",
    trigger: "",
    instantLoader: true,
    expertSettings: {
      js: "",
      css: "",
    },
  };
  // eslint-disable-next-line no-undef
  if (__Env__ === "testing") {
    // eslint-disable-next-line no-param-reassign
    storeConfig = {};
  } else {
    const c = storeConfig.selectedCurrencies;
    const cParced = validateJson(c);
    if (cParced) {
      storeConfig.selectedCurrencies = cParced;
    }
  }

  const config = { ...defaultConfig, ...storeConfig };

  /**
   * set shop and cart currencies for thankyou page from shopify global var
   */
  if (isThankyouPage || isOrderPage) {
    const {
      total_price_set: { presentment_money = {}, shop_money = {} },
    } = Shopify.checkout || {};
    config.userCurrency = (shop_money && shop_money.currency_code) || {};
    config.cartCurrency =
      (presentment_money && presentment_money.currency_code) || {};
    const currency = config.cartCurrency
      ? config.cartCurrency
      : config.userCurrency;
    config.money_format = currencyFormats[currency].money_format;
    config.money_with_currency_format =
      currencyFormats[currency].money_with_currency_format;

    /**
     * set currencybox position to floating(bottom-left) if
     * @param {boolean} floatingPositionOnThankyouPage
     * is enabled
     */

    if (config.floatingPositionOnThankyouPage) {
      if (config.displayPositionType !== "floating") {
        config.displayPositionType = "floating";
        config.displayPosition = "bottom_left";
        config.customOptionsPlacement = false;
      }
      if (config.mobileDisplayPositionType !== "floating") {
        config.mobileDisplayPositionType = "floating";
        config.mobileDisplayPosition = "bottom_left";
        config.customOptionsPlacementMobile = false;
      }
    }
  }

  /**
   * assigning  default for incorrect or empty values
   */
  if (!config.cartCurrency) config.cartCurrency = config.userCurrency;
  if (
    config.displayPositionType === "fixedPosition" &&
    !config.customPosition
  ) {
    config.displayPositionType = defaultConfig.displayPositionType;
    config.displayPosition = defaultConfig.displayPosition;
  }
  if (!config.mobileDisplayPositionType) {
    config.mobileDisplayPositionType = defaultConfig.displayPositionType;
    config.mobileDisplayPosition = defaultConfig.displayPosition;
  }
  if (config.multiCurrencies && config.multiCurrencies.length > 1)
    config.multiCurrencyEnabled = true;
  else config.multiCurrencyEnabled = false;

  config.baseCurrency = config.cartCurrency || config.userCurrency;
  config.baseMoneyFormat = config.money_format;
  config.baseMoneyWithCurrencyFormat = config.money_with_currency_format;

  if (!isRerender) {
    const currencyBox = ".buckscc-currency-box";
    const isWrapperExists = !!hxo$(currencyBox).length;
    config.isShortCode = isWrapperExists;
  }

  /**
   * test config override for a store
   */
  // config.showInDesktop = true;
  // config.selectedCurrencies = [
  //     { EUR: 'Euro (EUR)' },
  //     { BHD: 'Bahraini Dinar (BHD)' },
  //     { AED: 'United Arab Emirates Dirham (AED)' },
  //     { USD: 'US Dollar (USD)' },
  //     { QAR: 'Qatari Rial (QAR)' },
  //     { SAR: 'Saudi Riyal (SAR)' }
  // ];

  // checks weather the user using shortcode added in theme or not,
  // only check oninitialize

  config.priceSelector = "span.price,span.price2"; //
  // Assign current config to global Var
  window.bucksCC.config = config;
  window.bucksCC.errors = [];
  return config;
}
