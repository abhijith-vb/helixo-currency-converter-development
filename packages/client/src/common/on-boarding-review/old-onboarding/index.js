import React, { useState } from 'react';
import { Row, Col, Typography, Button, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { storageEngine } from '../../helper/commonMethods';
import CampaignSvg from '.././../../images/mission.svg';
import http from '../../http/httpProvider';
import Timer from '../../timer';
import '../../../style/components/onboardingProgress.scss';

const { Text, Title, Paragraph } = Typography;

export default function ({ setVisibility, progress = undefined, onProgressChange = () => { } }) {
    const { t } = useTranslation();

    const [timerStatus, setTimerStatus] = useState(false);

    const DISABLE_TIMER = false;

    const user = storageEngine.get('user');
    const SHOW_TIMER = !(user.plan_name && user.plan_name.match(/^(affiliate|partner_test|staff_business|staff|shopify_plus|trial)$/)) && !DISABLE_TIMER;

    return (
        <>
            <Card>

                <div className="onboarding-4-review">

                    <Row justify="center"><Title level={1}>{t('onBoardingProgress.step4.review.title')}</Title></Row>
                    <Row>
                        <Col span={12} className='onboarding-4-img'>
                            <img alt="campaign" src={CampaignSvg} />
                        </Col>
                        <Col span={12} className='onboarding-4-content'>
                            <Text className="onboarding-4-subheading">{t('onBoardingProgress.step4.review.subHeadingOne')}</Text>
                            <Paragraph>{t('onBoardingProgress.step4.review.paragraphOne')}</Paragraph>
                            <Text className="onboarding-4-subheading">{t('onBoardingProgress.step4.review.subHeadingTwo')}</Text>
                            <ul>
                                <li><Text>{t('onBoardingProgress.step4.review.listOne')}</Text></li>
                                <li><Text>{t('onBoardingProgress.step4.review.listTwo')}</Text></li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col span={24}>
                        <div style={{ textAlign: "center", display: 'block' }}>
                            <Paragraph style={{ fontWeight: 600, fontSize: '1.1em', color: '#47485a', marginBottom: '.4em' }}>{t('onBoardingProgress.step4.review.paragraphTwo')}</Paragraph>
                            <Paragraph style={{ marginBottom: '2em' }}>{t('onBoardingProgress.step4.review.paragraphThree')} 😊</Paragraph>
                        </div>
                    </Col>
                    <Col span={24} className='onboarding-4-button'>
                        {SHOW_TIMER && !timerStatus ?
                            <Text className="onboarding-4-subheading" style={{ margin: 0 }}>Congrats!! You're selected for one-time SECRET offer today! (Don't tell anyone 😉✌️)</Text>
                            : null}
                        <Text className="onboarding-4-subheading" style={{ margin: 0 }}>⭐️⭐️⭐️⭐️⭐️ (100+) 5 Star Reviews</Text>
                    </Col>
                    <Col span={24} className='onboarding-4-button'>
                        <Button type="primary" size="large"
                            onClick={() => {
                                http.postAction('api/v1/user/feedback', {
                                    feedbackGiven: true
                                })
                                    .then(res => {
                                        console.log('success')
                                        progress && onProgressChange(progress + 1)
                                        setVisibility(false)
                                        window.open('https://apps.shopify.com/bucks-currency-converter#modal-show=ReviewListingModal')
                                    })
                                    .catch(err => {
                                        console.log('failed')
                                    })

                            }}
                        > {SHOW_TIMER ? !timerStatus ? <>{t('onBoardingProgress.step4.review.iSupportAndClaim')} <Timer time="03:00" setTimerStatus={setTimerStatus} /></> : t('onBoardingProgress.step4.review.iSupportButton') : t('onBoardingProgress.step4.review.iSupportButton')}
                        </Button>
                        <Button type="default" size="large"
                            style={{ marginTop: '1em' }}
                            onClick={() => {
                                http.postAction('api/v1/user/feedback', {
                                    feedbackGiven: false
                                })
                                    .then(res => {

                                        setVisibility(false)
                                        console.log('success');
                                    })
                                    .catch(err => {
                                        console.log('failed')
                                    })
                            }
                            }
                        >{t('onBoardingProgress.step4.review.skipSupportMission')}</Button>
                    </Col>
                </Row>

            </Card>
        </>
    )
}