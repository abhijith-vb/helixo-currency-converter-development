const mongoose = require('mongoose');
// If Date.now itself is a date function so it call every time the document retrieves, so used Date.now() function it store the value
const userSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        accessToken: { type: String, required: true },
        id: { type: String, unique: true },
        // App specific
        first_installed: { type: Date },
        charge_id: { type: String },
        subscription_status: { type: String },
        last_billed_amount: { type: Number, default: 0 },
        trial_active_date: { type: Date },
        trial_end_date: { type: Date },
        last_used: { type: Date },
        is_active: { type: Boolean },
        eligible_for_payments: { type: Boolean },
        enabled_presentment_currencies: { type: Array },
        uninstalls: { type: Number, default: 0 },
        last_uninstall: { type: Date },
        appEnabled: { type: Boolean },
        scriptTagId: { type: String },
        onboardingProgress: { type: mongoose.Schema.Types.Mixed, default: { step: 0 } },
        feedbackRating: { type: Number },
        feedbackGiven: { type: Boolean },
        lastFeedbackTime: { type: Date },
        // Ad
        ufeClicked: { type: Boolean },
        // Shopify Specific
        name: { type: String },
        email: { type: String },
        domain: { type: String },
        province: { type: String },
        country: { type: String },
        address1: { type: String },
        zip: { type: String },
        city: { type: String },
        phone: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        primary_locale: { type: String },
        address2: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date },
        country_code: { type: String },
        country_name: { type: String },
        currency: { type: String },
        customer_email: { type: String },
        shop_owner: { type: String },
        money_format: { type: String },
        money_with_currency_format: { type: String },
        weight_unit: { type: String },
        province_code: { type: String },
        plan_display_name: { type: String },
        plan_name: { type: String },
        myshopify_domain: { type: String },
        password_enabled: { type: String },
        showedCheckoutConversion: { type: Boolean },
        alphaClicked: { type: Boolean },
        crispChat: {
            id: { type: String }
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
