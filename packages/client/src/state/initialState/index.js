export const initialState = {
    id: null,
    active: false,
    userCurrency: '',
    selectedCurrencies: [
        {
            USD: 'US Dollar (USD)'
        },
        {
            EUR: 'Euro (EUR)'
        },
        {
            GBP: "British Pound (GBP)"
        },
        {
            CAD: "Canadian Dollar (CAD)"
        },
    ],
    autoSwitchCurrencyLocationBased: true,
    moneyWithCurrencyFormat: false,
    autoSwitchOnlyToPreferredCurrency: false,
    showCurrencyCodesOnly: false,
    displayPositionType: 'floating', //floating, fixedPosition, header
    displayPosition: 'bottom_left', //bottom_left, bottom_right, top_right, top_left
    customPosition: '',
    positionPlacement: 'after',
    mobileDisplayPositionType: 'floating',
    mobileDisplayPosition: 'bottom_left',
    mobileCustomPosition: '',
    mobilePositionPlacement: 'after',
    showInDesktop: true,
    showInMobileDevice: true,
    showOriginalPriceOnMouseHover: false,
    customOptionsPlacement: false,
    optionsPlacementType: 'left_upwards',
    customOptionsPlacementMobile: false,
    optionsPlacementTypeMobile: 'left_upwards',
    cartNotificationStatus: false,
    cartNotificationMessage: 'We process all orders in {STORE_CURRENCY} and you will be checkout using the most current exchange rates.',
    cartNotificationBackgroundColor: { r: 251, g: 245, b: 245, a: 1 },
    cartNotificationTextColor: { r: 30, g: 30, b: 30, a: 1 },
    roundingDecimal: 0.99,
    priceRoundingType: 'none', //roundToDecimal, removeDecimal, none
    defaultCurrencyRounding: false,
    integrateWithOtherApps: true,
    themeType: 'default', // default, modernLayered
    backgroundColor: { r: 255, g: 255, b: 255, a: 1 },
    textColor: { r: 30, g: 30, b: 30, a: 1 },
    hoverColor: { r: 255, g: 255, b: 255, a: 1 },
    borderStyle: 'boxShadow', // boxShadow, borderLine, noBorder
    instantLoader: false,
    darkMode: false,
    flagStyle: 'modern', // traditional, modern
    flagTheme: 'rounded', // rounded, circle, flat
    flagDisplayOption: 'showFlagAndCurrency', // showFlagAndCurrency, showFlagOnly, showCurrencyOnly
    trigger:'',
    expertSettings: {
        css: ''
    }
};
