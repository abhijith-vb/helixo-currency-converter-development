const mongoose = require('mongoose');
// If Date.now itself is a date function so it call every time the document retrieves, so used Date.now() function it store the value
const settingsSchema = mongoose.Schema(
    {
        shop: { type: String },
        userId: { type: mongoose.Types.ObjectId, ref: 'user' },
        active: { type: Boolean },
        instantLoader: { type: Boolean },
        fixConversionFlickering: { type: Boolean },
        userCurrency: { type: String },
        selectedCurrencies: { type: String },
        autoSwitchCurrencyLocationBased: { type: Boolean },
        autoSwitchOnlyToPreferredCurrency: { type: Boolean },
        moneyWithCurrencyFormat: { type: Boolean },
        showCurrencyCodesOnly: { type: Boolean },
        displayPosition: { type: String },
        displayPositionType: { type: String },
        customPosition: { type: String },
        positionPlacement: { type: String },
        mobileDisplayPosition: { type: String },
        mobileDisplayPositionType: { type: String },
        mobileCustomPosition: { type: String },
        mobilePositionPlacement: { type: String },
        borderStyle: { type: String },
        showInDesktop: { type: Boolean },
        showInMobileDevice: { type: Boolean },
        customOptionsPlacement: { type: Boolean },
        optionsPlacementType: { type: String },
        customOptionsPlacementMobile: { type: Boolean },
        optionsPlacementTypeMobile: { type: String },
        showOriginalPriceOnMouseHover: { type: Boolean },
        cartNotificationStatus: { type: Boolean },
        cartNotificationMessage: { type: String },
        cartNotificationTextColor: { type: String },
        cartNotificationBackgroundColor: { type: String },
        additionalMoneySelectors: { type: String },
        roundPriceStatus: { type: Boolean },
        roundingDecimal: { type: Number },
        priceRoundingType: { type: String },
        defaultCurrencyRounding: { type: Boolean },
        integreteWithOtherApps: { type: Boolean },
        themeType: { type: String },
        backgroundColor: { type: String },
        textColor: { type: String },
        hoverColor: { type: String },
        darkMode: { type: Boolean },
        flagStyle: { type: String },
        flagTheme: { type: String },
        flagDisplayOption: { type: String },
        trigger:{type: String },
        expertSettings: {
            css: { type: String }
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model('Settings', settingsSchema);
