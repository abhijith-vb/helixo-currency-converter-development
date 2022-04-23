/**
 * 
 * @param {form values} values 
 * @param {*data before changing} userData 
 */
export const convertFormValuesToPostData = (values, userData) => {
    return {
        ...userData,
        ...values.Header,
        ...{
            ...values.CurrencySelector,
            ...{
                selectedCurrencies: JSON.stringify(
                    values.CurrencySelector.selectedCurrencies
                )
            },
            ...{
                textColor: `rgba(${values.CurrencySelector.textColor.r},${values.CurrencySelector.textColor.g},${values.CurrencySelector.textColor.b},${values.CurrencySelector.textColor.a})`
            },
            ...{
                backgroundColor: `rgba(${values.CurrencySelector.backgroundColor.r},${values.CurrencySelector.backgroundColor.g},${values.CurrencySelector.backgroundColor.b},${values.CurrencySelector.backgroundColor.a})`
            },
            ...{
                hoverColor: `rgba(${values.CurrencySelector.hoverColor.r},${values.CurrencySelector.hoverColor.g},${values.CurrencySelector.hoverColor.b},${values.CurrencySelector.hoverColor.a})`
            }
        },
        ...{
            ...values.DisplayBoxComponent,
            ...{
                cartNotificationBackgroundColor: `rgba(${values.DisplayBoxComponent.cartNotificationBackgroundColor.r},${values.DisplayBoxComponent.cartNotificationBackgroundColor.g},${values.DisplayBoxComponent.cartNotificationBackgroundColor.b},${values.DisplayBoxComponent.cartNotificationBackgroundColor.a})`
            },
            ...{
                cartNotificationTextColor: `rgba(${values.DisplayBoxComponent.cartNotificationTextColor.r},${values.DisplayBoxComponent.cartNotificationTextColor.g},${values.DisplayBoxComponent.cartNotificationTextColor.b},${values.DisplayBoxComponent.cartNotificationTextColor.a})`
            }
        },
        ...values.PriceDisplayOption,
        ...values.IntegrateWithOtherApps,
        ...values.ActivateInstantLoader,
        ...values.Advanced,
        ...{ expertSettings: JSON.stringify(values.Advanced.expertSettings) }
    }
}

export const convertHexToRgba = hex => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return {
        r,
        g,
        b,
        a: 1
    }
}
export const convertRGBAStringToObject = str => {
    //console.log(str)
    const match = str.replace(/^rgba?\(|\s+|\)$/g, '').split(',');;
    return {
        r: match[0],
        g: match[1],
        b: match[2],
        a: match[3]
    }
}

export const IsRGBAData = str => {
    if (typeof str === 'string' && str.includes('rgba')) {
        return true;
    }
    else {
        return false;
    }
}

export const convertInitialData = (userSettings) => {
    const newUserSettings = {
        ...userSettings,
        ...{
            backgroundColor: IsRGBAData(userSettings.backgroundColor) ?
                convertRGBAStringToObject(userSettings.backgroundColor) : convertHexToRgba(userSettings.backgroundColor)
        },
        ...{
            textColor: IsRGBAData(userSettings.textColor) ?
                convertRGBAStringToObject(userSettings.textColor) : convertHexToRgba(userSettings.textColor)
        },
        ...{
            hoverColor: IsRGBAData(userSettings.hoverColor) ?
                convertRGBAStringToObject(userSettings.hoverColor) : convertHexToRgba(userSettings.hoverColor)
        },
        ...{
            cartNotificationBackgroundColor: IsRGBAData(userSettings.cartNotificationBackgroundColor) ?
                convertRGBAStringToObject(userSettings.cartNotificationBackgroundColor) : convertHexToRgba(userSettings.cartNotificationBackgroundColor)
        },
        ...{
            cartNotificationTextColor: IsRGBAData(userSettings.cartNotificationTextColor) ?
                convertRGBAStringToObject(userSettings.cartNotificationTextColor) : convertHexToRgba(userSettings.cartNotificationTextColor)
        }
    }
    return newUserSettings
}

export const formatInitialData = (userData) => ({
    ...userData,
    selectedCurrencies: JSON.stringify(userData.selectedCurrencies),
    ...{
        backgroundColor: IsRGBAData(userData.backgroundColor) ?
            userData.backgroundColor : `rgba(${userData.backgroundColor.r},${userData.backgroundColor.g},${userData.backgroundColor.b},${userData.backgroundColor.a})`
    },
    ...{
        textColor: IsRGBAData(userData.textColor) ?
            userData.textColor : `rgba(${userData.textColor.r},${userData.textColor.g},${userData.textColor.b},${userData.textColor.a})`
    },
    ...{
        hoverColor: IsRGBAData(userData.hoverColor) ?
            userData.hoverColor : `rgba(${userData.hoverColor.r},${userData.hoverColor.g},${userData.hoverColor.b},${userData.hoverColor.a})`
    },
    ...{
        cartNotificationBackgroundColor: IsRGBAData(userData.cartNotificationBackgroundColor) ?
            userData.cartNotificationBackgroundColor : `rgba(${userData.cartNotificationBackgroundColor.r},${userData.cartNotificationBackgroundColor.g},${userData.cartNotificationBackgroundColor.b},${userData.cartNotificationBackgroundColor.a})`
    },
    ...{
        cartNotificationTextColor: IsRGBAData(userData.cartNotificationTextColor) ?
            userData.cartNotificationTextColor : `rgba(${userData.cartNotificationTextColor.r},${userData.cartNotificationTextColor.g},${userData.cartNotificationTextColor.b},${userData.cartNotificationTextColor.a})`
    }
})