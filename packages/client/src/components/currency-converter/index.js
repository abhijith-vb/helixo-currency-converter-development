import React, { useState, useEffect, useCallback } from 'react';
import { Form, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import Header from './header';
import CurrencySelector from './currency-selector';
import DisplayBoxComponent from './display-box';
import PriceDisplayOption from './price-display-option';
import Advanced from './advanced';
//import IntegrateWithOtherApps from './integrate-with-other-apps';
import OnBoardingProgress from '../on-boarding-progress';
import InstantLoader from './instant-loader';
import SpanTagInstruction from './../on-boarding-progress/spantag-instruction'
import OnboardingModal from './../../common/onboarding-modals';
import FirstTimeModal from './../first-time-modal';
import UfeAd from './ufe-2.0-add';
import AlphaAd from './alpha-ad';
import { initialState } from '../../state/initialState';
import http from './../../common/http/httpProvider';
import { storageEngine, isEmpty, validateUser } from '../../common/helper/commonMethods';
import Loader from '../../common/loader';
import LanguageSelector from './language-translator';
import Feedback from '../../common/on-boarding-review';
//for coverting form data to post data 
import { convertFormValuesToPostData, convertInitialData } from './../../common/common-methods'

import CustomPosition from './custom-position';
export default function (props) {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(initialState);
    const [progress, setProgress] = useState(0);
    const [spanTagAlreadyExist, setSpanTagAlreadyExist] = useState(null);
    const [saveButtonLoading, setSaveButtonLoading] = useState(false);
    const [nextButtonLoading, setNextButtonLoading] = useState(false);
    const [spanTagValue, setSpanTagValue] = useState({});
    const [language, setLanguage] = useState(null);
    const [spanTagAlert, setSpanTagAlert] = useState(false);
    const [onboardingSuccessModal, setOnboardingSuccessModal] = useState(false);
    const [hardRefreshAlert, setHardRefreshAlert] = useState(false);
    const [showRecommendedApps, setShowRecommendedApps] = useState(false);
    /** for first user for donot sending api request while switching instant loader */
    const [newUser, setNewUser] = useState(false);
    /** for checking user settings contains roundPriceStatus */
    const [oldData, setOldData] = useState(false)
    /**for checking feedback given or not */
    const [feedbackOnboarding, setFeedbackOnboarding] = useState(false);
    // for showing first time instruction modal
    const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);

    const { i18n, t } = useTranslation();
    const ONBOARDING_LAST_STEP = 3;
    /**Time difference to show feedbcak */
    const TIME_DIFFERENCE = 1000 * 60 * 60 * 24 * 2;

    const [form] = Form.useForm();

    const user = storageEngine.get('user');
    // const showFeedback = user.plan_name && user.plan_name.match(/^(affiliate|partner_test|staff_business|staff|shopify_plus|trial)$/);

    useEffect(() => {
        // const isNewUser = storageEngine.get("isNewUser");
        // if (isNewUser) {
        //     setShowFirstTimeModal(true);
        // }
        http
            .getAction(`api/v1/settings`)
            .then(response => {
                const { data = {} } = response;
                //console.log(data)
                if (isEmpty(data)) {
                    setNewUser(true);
                    setShowFirstTimeModal(true);
                    const newSettings = convertInitialData(initialState);
                    setUserData(newSettings);
                }
                else {
                    let userSettings = {
                        ...initialState,
                        ...data,
                        ...{
                            selectedCurrencies: JSON.parse(data.selectedCurrencies)
                        },
                        ...{ expertSettings: JSON.parse(data.expertSettings) || JSON.parse(initialState.expertSettings) }
                    };
                    /** for converting old color hex values to rgba */
                    userSettings = convertInitialData(userSettings)
                    // userSettings = {
                    //     ...userSettings,
                    //     ...{
                    //         backgroundColor: IsRGBAData(userSettings.backgroundColor) ?
                    //             convertRGBAStringToObject(userSettings.backgroundColor) : convertHexToRgba(userSettings.backgroundColor)
                    //     },
                    //     ...{
                    //         textColor: IsRGBAData(userSettings.textColor) ?
                    //             convertRGBAStringToObject(userSettings.textColor) : convertHexToRgba(userSettings.textColor)
                    //     },
                    //     ...{
                    //         hoverColor: IsRGBAData(userSettings.hoverColor) ?
                    //             convertRGBAStringToObject(userSettings.hoverColor) : convertHexToRgba(userSettings.hoverColor)
                    //     },
                    //     ...{
                    //         cartNotificationBackgroundColor: IsRGBAData(userSettings.cartNotificationBackgroundColor) ?
                    //             convertRGBAStringToObject(userSettings.cartNotificationBackgroundColor) : convertHexToRgba(userSettings.cartNotificationBackgroundColor)
                    //     },
                    //     ...{
                    //         cartNotificationTextColor: IsRGBAData(userSettings.cartNotificationTextColor) ?
                    //             convertRGBAStringToObject(userSettings.cartNotificationTextColor) : convertHexToRgba(userSettings.cartNotificationTextColor)
                    //     }
                    // }
                    if (userSettings.hasOwnProperty('roundPriceStatus') && userSettings.roundPriceStatus) {
                        setOldData(true);
                        userSettings = {
                            ...userSettings,
                            ...{ priceRoundingType: userSettings.roundPriceStatus ? 'roundToDecimal' : 'none' }
                        }
                    }
                    setUserData(userSettings);
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        /**
         * checking the user is  feedback given or not
         */

        const urlString = window.location;
        const url = new URL(urlString);
        console.log(user);

        i18n.changeLanguage(storageEngine.get('userLang') || url.searchParams.get("locale") || (user && user.primary_locale))
        setLanguage(storageEngine.get('userLang') || url.searchParams.get("locale") || (user && user.primary_locale))
        const moneyFormat = user && user.money_format ? user.money_format : null;
        const moneyWithCurrencyFormat = user && user.money_with_currency_format ? user.money_with_currency_format : null;
        const step = user && user.onboardingProgress && user.onboardingProgress.step ? user.onboardingProgress.step : 0;
        const ufeClicked = user.ufeClicked;
        if (!moneyFormat.includes('<span class=money>') || !moneyWithCurrencyFormat.includes('<span class=money>')) {
            setSpanTagAlert(true);
            setSpanTagAlreadyExist(false);
            setSpanTagValue({
                moneyFormat: moneyFormat.replace(/(<([^>]+)>)/ig, ''),
                moneyWithCurrencyFormat: moneyWithCurrencyFormat.replace(/(<([^>]+)>)/ig, '')
            });
        }
        else {
            setSpanTagAlreadyExist(true);
            setSpanTagValue({
                moneyFormat,
                moneyWithCurrencyFormat
            });
        }

        /**for checking feedback given or not */
        let currentDate = new Date().getTime()
        let lastFeedbackTime = new Date(user.lastFeedbackTime).getTime()
        let difference = !lastFeedbackTime ? TIME_DIFFERENCE + 1 : currentDate - lastFeedbackTime;
        if (// user.feedbackGiven === undefined ||
            (validateUser(user.plan_name) && step === 3 && !user.feedbackGiven && difference > TIME_DIFFERENCE)) {
            setFeedbackOnboarding(true);
        }
        // else 
        if (step >= 3 && !ufeClicked) {
            setShowRecommendedApps(true);
            storageEngine.set('showUfeAd', true);
        }
        else {
            storageEngine.set('showUfeAd', false);
        }
        setProgress(step);
        // show ufe card

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TIME_DIFFERENCE, i18n]);
    const onFinish = values => {
        newUser && setNewUser(false);
        setSaveButtonLoading(true);
        !spanTagAlert && progress >= ONBOARDING_LAST_STEP && setHardRefreshAlert(true);
        let postData = convertFormValuesToPostData(values, userData)
        if (oldData) {
            postData = {
                ...postData,
                ...{ roundPriceStatus: null }
            }
        }
        console.log(postData)
        postData.demoMode = undefined;
        http
            .postAction(`api/v1/settings`, postData)
            .then(res => {
                const { message = 'Save Success' } = res;
                notification.success({
                    message
                });
                console.log('successfully updated');
                setSaveButtonLoading(false);
                // Go to next onboarding only if the saved successfully
                if (progress === 1 && values.Header.active) {
                    onProgressChange(progress + 2);
                    setOnboardingSuccessModal(true);
                }
                else if (progress === 1) {
                    onProgressChange(progress + 1);
                }
            })
            .catch(error => {
                const { message = 'Error on saving!' } = error;
                notification.error({
                    message
                });
                console.log('Error on saving', error);
                setSaveButtonLoading(false);
            });

    };
    const checkRoundingDecimal = (rule, value) => {
        if (
            (value.roundingDecimal === '0.' || value.roundingDecimal === '0.0') &&
            value.roundPriceStatus === true
        ) {
            return Promise.reject('');
        } else {
            return Promise.resolve();
        }
    };
    const checkSelectedCurrenciesLength = (rule, values) => {
        if (values.selectedCurrencies.length === 0) {
            return Promise.reject(' ');
        } else {
            return Promise.resolve();
        }
    };
    const onProgressChange = value => {
        if (value === 1 || ((value > 3) && spanTagAlert)) {
            setNextButtonLoading(true);
            http
                .getAction('api/v1/user/latest')
                .then(res => {
                    setNextButtonLoading(false);
                    const data = res.data;
                    //console.log(data);
                    if (
                        !(
                            data.money_format.includes('<span class=money>') &&
                            data.money_with_currency_format.includes('<span class=money>')
                        )
                    ) {
                        notification.error({
                            message: t('onBoardingProgress.step1.spanTagError')
                        });
                        setNextButtonLoading(false);
                        return;
                    }
                    else {
                        setSpanTagAlert(false);
                        if (value === 1) {
                            setProgress(value);
                            http
                                .postAction('api/v1/user/onboarding', { step: value })
                                .then(res => {
                                    console.log(res);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            const user = storageEngine.get('user');
                            storageEngine.set('user', {
                                ...user,
                                ...{
                                    onboardingProgress: {
                                        step: value
                                    }
                                }
                            });
                        }
                        setNextButtonLoading(false);
                    }
                })
                .catch(err => {
                    console.log('eeror');
                    //setNextButtonLoading(false);
                    notification.error({
                        message: t('onBoardingProgress.step1.spanTagError')
                    });
                    setNextButtonLoading(false);
                    return;
                });
        }
        else if (feedbackOnboarding) {
            setFeedbackOnboarding(false);
        }
        else {
            setProgress(value);
            http
                .postAction('api/v1/user/onboarding', { step: value })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
            const user = storageEngine.get('user');
            storageEngine.set('user', {
                ...user,
                ...{
                    onboardingProgress: {
                        step: value
                    }
                }
            });
        }

    };
    const handleLanguageChange = lang => {
        i18n.changeLanguage(lang);
        storageEngine.set('userLang', lang);
        setLanguage(lang);
    }
    // /**
    //  * to check valid json string or not
    //  * @param {str} str 
    //  */
    // const IsRGBAData = str => {
    //     if (str.includes('rgba')) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    // const convertHexToRgba = hex => {
    //     hex = hex.replace('#', '');
    //     let r = parseInt(hex.substring(0, 2), 16);
    //     let g = parseInt(hex.substring(2, 4), 16);
    //     let b = parseInt(hex.substring(4, 6), 16);
    //     return {
    //         r,
    //         g,
    //         b,
    //         a: 1
    //     }
    // }
    // const convertRGBAStringToObject = str => {
    //     //console.log(str)
    //     const match = str.replace(/^rgba?\(|\s+|\)$/g, '').split(',');;
    //     return {
    //         r: match[0],
    //         g: match[1],
    //         b: match[2],
    //         a: match[3]
    //     }
    // }
    return (
        <div className="Main-div buckscc-ui">
            {!loading ? (
                <div>
                    {showFirstTimeModal && <FirstTimeModal
                        visible={showFirstTimeModal}
                        setVisible={setShowFirstTimeModal}
                    />}

                    <Form
                        name="cashCoverterClientForm"
                        form={form}
                        initialValues={{
                            Header: {
                                active: userData.active,

                            },
                            CurrencySelector: {
                                selectedCurrencies: userData.selectedCurrencies,
                                autoSwitchCurrencyLocationBased:
                                    userData.autoSwitchCurrencyLocationBased,
                                moneyWithCurrencyFormat: userData.moneyWithCurrencyFormat,
                                themeType: userData.themeType,
                                backgroundColor: userData.backgroundColor,
                                textColor: userData.textColor,
                                hoverColor: userData.hoverColor,
                                borderStyle: userData.borderStyle,
                                darkMode: userData.darkMode,
                                flagStyle: userData.flagStyle,
                                flagTheme: userData.flagTheme,
                                showCurrencyCodesOnly: userData.showCurrencyCodesOnly,
                                flagDisplayOption: userData.flagDisplayOption,
                                displayPositionType: userData.displayPositionType,
                                customPosition: userData.customPosition,
                                displayPosition: userData.displayPosition,
                                positionPlacement: userData.positionPlacement,
                                mobileDisplayPositionType: userData.mobileDisplayPositionType,
                                mobileCustomPosition: userData.mobileCustomPosition,
                                mobileDisplayPosition: userData.mobileDisplayPosition,
                                mobilePositionPlacement: userData.mobilePositionPlacement,
                                showInDesktop: userData.showInDesktop,
                                showInMobileDevice: userData.showInMobileDevice,
                                customOptionsPlacement: userData.customOptionsPlacement,
                                optionsPlacementType: userData.optionsPlacementType,
                                customOptionsPlacementMobile: userData.customOptionsPlacementMobile,
                                optionsPlacementTypeMobile: userData.optionsPlacementTypeMobile,
                                showOriginalPriceOnMouseHover:
                                    userData.showOriginalPriceOnMouseHover,
                                autoSwitchOnlyToPreferredCurrency: userData.autoSwitchOnlyToPreferredCurrency
                            },
                            DisplayBoxComponent: {
                                cartNotificationStatus: userData.cartNotificationStatus,
                                cartNotificationMessage: userData.cartNotificationMessage,
                                cartNotificationBackgroundColor: userData.cartNotificationBackgroundColor,
                                cartNotificationTextColor: userData.cartNotificationTextColor
                            },
                            PriceDisplayOption: {
                                priceRoundingType: userData.priceRoundingType,
                                defaultCurrencyRounding: userData.defaultCurrencyRounding,
                                roundingDecimal: userData.roundingDecimal
                            },
                            IntegrateWithOtherApps: {
                                integrateWithOtherApps: userData.integrateWithOtherApps
                            },
                            ActivateInstantLoader: {
                                instantLoader: userData.instantLoader
                            },
                            Advanced: {
                                trigger:userData.trigger,
                                expertSettings: userData.expertSettings
                            }
                        }}
                        onFinish={onFinish}
                        onValuesChange={(value, changedValue) => {
                            setUserData(convertFormValuesToPostData(changedValue, userData))
                        }}
                    >
                        <Form.Item name="Header" shouldUpdate={() => true}>
                            <Header
                                progress={progress}
                                onProgressChange={onProgressChange}
                                loading={saveButtonLoading}
                                // language={language}
                                // handleLanguageChange={handleLanguageChange}
                                spanTagAlert={spanTagAlert}
                                hardRefreshAlert={hardRefreshAlert}
                                setHardRefreshAlert={setHardRefreshAlert}
                                showRecommendedApps={showRecommendedApps}
                                setShowRecommendedApps={setShowRecommendedApps}
                                form={form}

                            />
                        </Form.Item>
                        {feedbackOnboarding && <Feedback setVisibility={setFeedbackOnboarding} setShowRecommendedApps={setShowRecommendedApps} />}
                        <Form.Item name="Header">
                            {(progress < 3 || (feedbackOnboarding && !spanTagAlert)) && (
                                <OnBoardingProgress
                                    progress={progress}
                                    onProgressChange={onProgressChange}
                                    spanTagAlreadyExist={spanTagAlreadyExist}
                                    saveButtonLoading={saveButtonLoading}
                                    loading={nextButtonLoading}
                                    spanTags={spanTagValue}
                                    feedbackOnboarding={feedbackOnboarding}
                                    setFeedbackOnboarding={setFeedbackOnboarding}
                                    setOnboardingSuccessModal={setOnboardingSuccessModal}
                                    setShowRecommendedApps={setShowRecommendedApps}

                                />
                            )}
                        </Form.Item>
                        {progress >= 3 && spanTagAlert &&
                            <SpanTagInstruction
                                progress={progress}
                                onProgressChange={onProgressChange}
                                spanTagAlreadyExist={spanTagAlreadyExist}
                                loading={nextButtonLoading}
                                spanTags={spanTagValue}
                            />
                        }
                        <Form.Item
                            name="CurrencySelector"
                            rules={[
                                {
                                    validator: checkSelectedCurrenciesLength
                                }
                            ]}
                        >
                            <CurrencySelector userData={userData} />
                        </Form.Item>
                        <Form.Item name="ActivateInstantLoader">

                            <InstantLoader newUser={newUser} />
                        </Form.Item>
                        <Form.Item name="DisplayBoxComponent">
                            <DisplayBoxComponent />
                        </Form.Item>
                        <Form.Item
                            name="PriceDisplayOption"
                            rules={[
                                {
                                    validator: checkRoundingDecimal
                                }
                            ]}
                        >
                            <PriceDisplayOption />
                        </Form.Item>
                        <Form.Item name="Advanced">
                            <Advanced />
                        </Form.Item>
                        <CustomPosition />
                        <UfeAd />
                        <AlphaAd progress={progress} />
                        <LanguageSelector language={language} handleLanguageChange={handleLanguageChange} />
                        {onboardingSuccessModal && <OnboardingModal form={form} setFeedbackOnboarding={setFeedbackOnboarding} visible={onboardingSuccessModal} />}
                        {/* <Form.Item name="IntegrateWithOtherApps">
              <IntegrateWithOtherApps />
            </Form.Item> */}
                    </Form>
                </div>
            ) : <Loader />
            }

        </div>
    );
}
