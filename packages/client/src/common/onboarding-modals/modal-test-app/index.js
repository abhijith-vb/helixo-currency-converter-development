import React, { useState } from 'react';
import { Typography, Button, Modal, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import allWorksPerfect from './../../../images/allWorksPerfect.svg';
//import feedbackSvg from './../../../images/feedback.svg';
import { storageEngine, validateUser } from '../../helper/commonMethods';
import checkoutSvg from './../../../images/support-checkout.svg';
import http from './../../http/httpProvider'
import { triggerMessage } from '../../../extras/crispChat';
import { SENT_QUERY,SUCCESS_QUERY,ERROR_QUERY } from '../../../common/constants/constants';
// import Rater from 'react-rater'
// import Timer from '../../../common/timer';
// import OnBoardingReview from '../../on-boarding-review';
//import 'react-rater/lib/react-rater.scss'
import CheckoutConversionInfo from '../../checkout-convertion';

import './model-test-app.scss';

const { Title, Text, Paragraph } = Typography;
//const { TextArea } = Input;
export default function ({ callbackVisibility,
    callbackStatus,
    setCallBackStatus,
    setCallbackVisibility,
    progress,
    onProgressChange,
    setFeedbackOnboarding,
    form
}) {
    const { t } = useTranslation();
    // for timer
    // const [timerStatus, setTimerStatus] = useState(false);

    const user = storageEngine.get('user');


    const sentSupportMessage =(success)=>{
        const queryMessage = success?SUCCESS_QUERY:ERROR_QUERY;
        triggerMessage(SENT_QUERY,user,queryMessage)
    }
    const handleSomethingWrong = () => {
        http.postAction('api/v1/user/onboarding', {
            feedbackGiven: false
        })
            .then(res => {
                onProgressChange(progress + 1);
                setCallbackVisibility(false);
                // window.fcWidget && window.fcWidget.open()
                // console.log('success');
            })
            .catch(err => {
                // console.log('failed')
                setCallbackVisibility(false);
            })
    }

    const handleWorksPerfect = () => {
        // setCallBackStatus('worksGood');
        setCallbackVisibility(false);
        if (validateUser(user.plan_name)) setFeedbackOnboarding(true);
        // onProgressChange(progress + 1);
        // to open chat widget

        storageEngine.set('showUfeAd', true);
        // if (window.fcWidget)
        //     window.fcWidget.track('bucks_onboarding_review', {
        //         value: true,
        //     });

    }


    return (
        <>
            <Modal
                visible={callbackVisibility}
                footer={null}
                //   onOk={handleButtonClick}

                closable={false}
                width={'620px'}
                style={{ textAlign: 'center' }}
            >
                {callbackStatus === 'callback' && (
                    <div>
                        <img
                            alt="modal-header"
                            className="onboarding-Image"
                            style={{ width: '400px', padding: '2em' }}
                            src={allWorksPerfect}
                        />
                        <Title level={2}>{t('onBoardingProgress.testApplication.allWorksPerfect')}</Title>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                                // sentSupportMessage(true)
                                setCallBackStatus('enableCheckoutConversion')
                            }}
                            style={{ marginRight: '10px' }}
                        >
                            {t('onBoardingProgress.testApplication.yesItIsPerfect')}
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            style={{ marginLeft: '10px' }}
                            onClick={()=>{
                                // sentSupportMessage(false)
                                handleSomethingWrong()
                            }}
                        >
                            {t('onBoardingProgress.testApplication.noINeedHelp')}
                        </Button>
                    </div>
                )}
                {callbackStatus === 'enableCheckoutConversion' &&
                    <div>
                        <Title level={2}>Do you want to enable currency conversion in checkout?</Title>
                        <img className="onboarding-checkout-img" src={checkoutSvg} />
                        <Row justify="center">

                            <Button
                                type="primary"
                                size="large"
                                onClick={handleWorksPerfect}
                                style={{ marginRight: '10px', width: '200px' }}
                            >
                                No
                        </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => {
                                    setCallBackStatus('showCheckoutConversionInfo')
                                }}
                                style={{ marginRight: '10px', width: '200px' }}
                            >
                                Yes
                        </Button>
                        </Row>
                    </div>
                }
                {callbackStatus === 'showCheckoutConversionInfo' &&
                    <CheckoutConversionInfo user={user} form={form} handleCTA={handleWorksPerfect} />
                }

                {/* {callbackStatus === 'worksGood' && (
                    <div>

                        <Title level={3}>{t('onBoardingProgress.testApplication.pleaseGiveYourFeedback')}</Title>

                        <Rater total={5} rating={0}
                            onRate={(rate) => {
                                //console.log(rate.rating)
                                if (rate.rating < 4) {
                                    window.fcWidget && window.fcWidget.open()
                                }
                                else if (showReview()) {
                                    setCallBackStatus('review');
                                }
                                else {
                                    // onProgressChange(progress + 1);
                                    setCallbackVisibility(false);
                                }
                                http.postAction('api/v1/user/onboarding', {
                                    feedbackRating: rate.rating
                                })
                                    .then(res => {
                                        console.log('success')
                                        progress && onProgressChange(progress + 1)
                                    })
                                    .catch(err => {
                                        console.log('failed')
                                    })
                                rate.rating < 4 && setCallbackVisibility(false);
                            }}
                        />
                        <Button
                            type="default"
                            style={{ marginRight: '10px', marginTop: '10px' }}
                            onClick={() => {
                                // http.postAction('api/v1/user/feedback', {
                                //     feedbackGiven: false
                                // })
                                //     .then(res => {
                                //         console.log('success')
                                //     })
                                //     .catch(err => {
                                //         console.log('failed')
                                //     })
                                // setCallbackVisibility(false);
                                if (showReview()) {
                                    setCallBackStatus('review');
                                } else {
                                    // onProgressChange(progress + 1);
                                    setCallbackVisibility(false);
                                }

                            }}
                        >
                            {t('onBoardingProgress.testApplication.skip')}
                        </Button>


                    </div>
                )} */}
                {/*callbackStatus === 'worksBad' && (
                    <div>
                        <img
                            className="onboarding-Image"
                            alt="modal-header"
                            src={contactSvg}
                            width={150}
                            height={150}
                        />
                        <Title level={4}>{t('onBoardingProgress.testApplication.contactYourCustomerSupportTeam')}</Title>
                        <Text>support@helixo.co</Text>
                        <br />
                        <Button
                            type="primary"
                            style={{ marginTop: '10px' }}
                            onClick={() => {
                                setCallbackVisibility(false);
                            }}
                        >
                            {t('onBoardingProgress.testApplication.close')}
                        </Button>
                    </div>
                        )*/}
                {/* {callbackStatus === 'review' && (
                    <div className='review-modal'>
                        <OnBoardingReview
                            setVisibility={setCallbackVisibility}
                            progress={progress}
                            onProgressChange={onProgressChange}
                        />

                    </div>
                )} */}
            </Modal>
        </>
    )
}