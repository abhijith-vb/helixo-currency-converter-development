import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Typography,
    Button,
    Switch,
    notification,
    Alert,
    Spin
} from 'antd';
import LanguageTranslator from './../language-translator';
import http from '../../../common/http/httpProvider';
import { useTranslation } from 'react-i18next';
import { storageEngine } from '../../../common/helper/commonMethods';
import OnBoardingModal from './../../../common/onboarding-modals';
import CheckoutConversionAlert from './checkout-convertion';

import ufeLogo from '../../../images/ufe-logo.svg';

import './header.scss';
const { Title } = Typography;

const SHOW_UFEAD_ON_HEADER = false;

const HIDE_UFE_AD = true;

export default function ({
    value = {},
    onChange,
    progress,
    onProgressChange,
    loading,
    // language,
    // handleLanguageChange,
    spanTagAlert,
    hardRefreshAlert,
    setHardRefreshAlert,
    showRecommendedApps,
    setShowRecommendedApps,
    form
}) {
    const [visible, setVisibility] = useState(false);
    const [appStatusLoading, setAppStatusLoading] = useState(false);
    const [showCheckoutConversionInfo, setShowCheckoutConversionInfo] = useState(false);
    const [showCheckoutConversionInfoModal, setShowCheckoutConversionInfoModal] = useState(false);
    const { t } = useTranslation();
    const showModal = () => {
        setVisibility(true);
    };

    const user = storageEngine.get('user');

    useEffect(() => {
        // to show checkout currency alert
        if (!user.showedCheckoutConversion && progress >= 3) {
            setShowCheckoutConversionInfo(true);
        }
    }, [user])

    const openNotificationWithIcon = value => {
        notification['success']({
            message: value ? 'App status enabled' : 'App status disabled',
            duration: 1,
            placement: 'topRight'
        });
    };
    const handleUfeClicked = () => {
        http
            .postAction('api/v1/user/adClickTrack', { ufeClicked: true })
            .then(res => {
                setShowRecommendedApps(false);
            })
            .catch((err) => {
                //eerr
            })
    }

    const handleShowCheckoutConversion = () => {
        setShowCheckoutConversionInfoModal(true);
    }
    return (
        <div className="Header">
            {showCheckoutConversionInfoModal &&
                <CheckoutConversionAlert form={form} user={user}
                    showModal={showCheckoutConversionInfoModal}
                    setShowModal={setShowCheckoutConversionInfoModal}
                    setShowCheckoutConversionInfo={setShowCheckoutConversionInfo}
                />}
            {visible && <OnBoardingModal visible={visible} form={form} />}
            <Row>
                <Col span={17} className="Header-Title">
                    {showRecommendedApps && !showCheckoutConversionInfo && SHOW_UFEAD_ON_HEADER && (<>
                        <Title level={2}>{t('settings.header.title')}</Title>
                        <div style={{ padding: '15px', width: '400px' }} class="display-box currencySelector-main hxoPolaris-Card">
                            <h5 class="ant-typography" style={{ color: 'red', fontSize: '15px' }}>Recommended App</h5><a href="https://apps.shopify.com/upsell-funnel-engine-upsells?utm_source=bucks-app&utm_medium=banner&utm_campaign=cta" target="_blank"><img src={ufeLogo} /></a>

                            <div className="ufe-ad-desc" style={{ marginTop: '15px' }}>
                                <div>🎨 &nbsp; Clean Design <br />🔥 &nbsp; 1.79x Revenue <br />💯 &nbsp; 4 Upsell Types <br />✨ &nbsp; 3 Upsell Styles</div>
                                <div>👀 &nbsp; Unlimited Funnel Views <br />🧪 &nbsp; Unlimited Split tests <br />👇🏻 &nbsp; Unlimited Downsells <br />🤩 &nbsp; Unlimited Funnels</div>
                            </div>
                            <a href="https://apps.shopify.com/upsell-funnel-engine-upsells?utm_source=bucks-app&utm_medium=banner&utm_campaign=cta" target="_blank"><Button type="primary" onClick={handleUfeClicked}><span>🎁</span><span style={{ marginLeft: '10px' }}> Claim FREE plan!</span></Button></a>
                            <div style={{ marginTop: '10px', fontWeight: 600, fontStyle: 'italic' }}>
                                <span>FREE Offer is limited to 240 BUCKS Merchants Only.</span>
                            </div>
                        </div>
                    </>)}
                    {showCheckoutConversionInfo && <Col span={15}>
                        <Alert message={<a onClick={handleShowCheckoutConversion}>How to enable currency conversion in checkout?</a>} type="info" showIcon />
                    </Col>}
                </Col>
                <Col span={5} className="buckscc-status-header">
                    <Title level={4}>{t('settings.header.appStatus')}</Title>
                    <Switch
                        name="active"
                        size="default"
                        className="Status-switch"
                        checked={value.active}
                        disabled={appStatusLoading}
                        onChange={change => {
                            progress !== 2 && setAppStatusLoading(true);
                            const postData = { active: change };
                            http
                                .postAction('api/v1/settings/setStatus', postData)
                                .then(res => {
                                    openNotificationWithIcon(change);
                                    onChange({
                                        ...value,
                                        ...{ active: change }
                                    });
                                    if (progress === 2) {
                                        onProgressChange(progress + 1);
                                        change && showModal();
                                    }
                                    setAppStatusLoading(false);
                                })
                                .catch(error => {
                                    const { message = 'Error on saving!' } = error;
                                    notification.error({
                                        message
                                    });
                                    console.log('Error on saving', error);
                                    setAppStatusLoading(false);
                                });
                            // if (progress === 2) {
                            //     onProgressChange(progress + 1);
                            //     showModal();
                            // }
                        }}
                    />
                    <Spin spinning={appStatusLoading}>
                    </Spin>
                </Col>
                <Col span={2} className="Header-Button">
                    <Button
                        style={{ padding: '14px 42px', height: 'auto' }}
                        type="primary"
                        loading={loading}
                        size="large"
                        htmlType="submit"
                    >
                        {t('settings.header.save')}
                    </Button>
                </Col>
            </Row>
            {/* <Row>
                <Col span={2}>
                    <LanguageTranslator language={language} handleLanguageChange={handleLanguageChange} />
                </Col>
            </Row> */}
            {spanTagAlert && <Row>
                <Col span={24} className='margin-top-20'>
                    <Alert type="error" showIcon message={t('onBoardingProgress.step1.spanTagAlertMessage')} description={t('onBoardingProgress.step1.spanTagAlertDescription')} />
                </Col>
            </Row>}
            {hardRefreshAlert && <Row>
                <Col span={24} className='margin-top-20 buckscc-saveAlert'>
                    <Alert type="warning" showIcon message={t('hardRefreshAlert.title')}
                        description={<>
                            <p>{t('hardRefreshAlert.contentOnWindows')}</p>
                            <p>{t('hardRefreshAlert.contentOnMacChrome')}</p>
                            <p>{t('hardRefreshAlert.contentOnMacSafari')}</p>
                        </>}
                        closable
                        onClose={() => {
                            setHardRefreshAlert(false);
                        }}
                    />
                </Col>
            </Row>
            }
        </div>
    );
}
