/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Input, Button, Row, Col, Timeline, message } from 'antd';
import { LikeOutlined, CopyOutlined, YoutubeFilled } from '@ant-design/icons';
import thumbsup from '../../../images/thumbsup.svg';
import { storageEngine } from '../../../common/helper/commonMethods';
import instructionsImage from '../../../images/buckscc-instructions.png';

const { Text, Title } = Typography;

export default function (props) {
    const { t } = useTranslation();
    const [loadIframe, setLoadIframe] = useState(false);
    const copyTextOne = props.spanTagAlreadyExist
        ? props.spanTags.moneyFormat
        : `<span class=money>${props.spanTags.moneyFormat}</span>`;
    const copyTextTwo = props.spanTagAlreadyExist
        ? props.spanTags.moneyWithCurrencyFormat
        : `<span class=money>${props.spanTags.moneyWithCurrencyFormat}</span>`;
    const userStoreUrl = (storageEngine.get('user') || {}).myshopify_domain;
    const shopifySettingsUrl = `//${userStoreUrl}/admin/settings/general`;
    const handlingVideoPlay = () => {
        setLoadIframe(true);
    }
    return (
        <div className="onBoardingItem">
            <Card title={t('onBoardingProgress.step1.caption')} bordered={false}>
                {!props.spanTagAlreadyExist && <Row >
                    <Title level={3} className="margin-bottom-20">{t('onBoardingProgress.step1.instructionForMoneyFormat')}</Title>
                    <Timeline>
                        <Timeline.Item>{t('onBoardingProgress.step1.step1')}<strong>{t('onBoardingProgress.step1.goToShopify')} <a target="_blank" rel="noopener noreferrer" href={shopifySettingsUrl}>{t('onBoardingProgress.step1.settingsGeneral')}</a></strong></Timeline.Item>
                        <Timeline.Item>{t('onBoardingProgress.step1.step2')} {t('onBoardingProgress.step1.clickOn')}<strong>{t('onBoardingProgress.step1.changeFormatting')}</strong>{t('onBoardingProgress.step1.inStoreCurrencySection')}</Timeline.Item>
                        <Timeline.Item>{t('onBoardingProgress.step1.step3')}<strong>{t('onBoardingProgress.step1.copyAndPaste')}</strong>{t('onBoardingProgress.step1.theAboveMoneyFormatLikeTheFollowing')}
                            <br /><br />
                            <div onClick={handlingVideoPlay} className='instruction-box'>
                                {!loadIframe && <YoutubeFilled className='youtube-button' onClick={handlingVideoPlay} />}
                                {
                                    !loadIframe ? <img alt="Moneyformat setup Instructions" src={instructionsImage} />
                                        : <iframe style={{ maxWidth: '100%', borderRadius: '10px' }} className='spantag-iframe' title="setting span tag" src="https://www.youtube.com/embed/CHUN5HCEpik?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                }

                            </div>
                            <div style={{ marginTop: '2em' }}>
                                <strong><a href="https://www.youtube.com/watch?v=CHUN5HCEpik" target="_blank">👀 Watch tutorial in full screen</a></strong>
                            </div>
                        </Timeline.Item>
                        <Timeline.Item dot={<LikeOutlined style={{ fontSize: '16px', color: '#2a8ef7' }} />}>
                            {/* <br /><br /> */}
                            <strong>{t('onBoardingProgress.step1.youAreDone')}</strong>
                        </Timeline.Item>
                    </Timeline>
                </Row>
                }
                {props.spanTagAlreadyExist && (
                    <div className="onboardingItem-Content" style={{ textAlign: 'center', marginBottom: '2em' }}>
                        <div>
                            <img alt="Success onboarding step 1" className="onboarding-Image" src={thumbsup} />
                        </div>
                        <Title level={4}>{t('onBoardingProgress.step1.youHaveAlreadyDoneThis')}</Title>
                    </div>
                )}

                <Text>{t('onBoardingProgress.step1.HTMLWithCurrency')}</Text>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }} >
                    <Col span={20}>
                        <Input value={copyTextTwo} disabled={true} />
                    </Col>
                    <Col>
                        {/* {!props.spanTagAlreadyExist ? ( */}
                        <Button
                            type="primary"
                            onClick={() => {
                                message.config({
                                    top: 310
                                })
                                message.success(t('onBoardingProgress.step1.copied'))
                                copy(copyTextTwo);
                            }}
                        >
                            <CopyOutlined /> {t('onBoardingProgress.step1.copy')}
                        </Button>
                        {/* ) : (
                                <img alt="" className="onboarding-Image" src={correctSvg} />
                            )} */}
                    </Col>
                </Row>
                <Text>{t('onBoardingProgress.step1.HTMLWithoutCurrency')}</Text>
                <Row style={{ marginTop: '10px' }}>
                    <Col span={20}>
                        <Input value={copyTextOne} disabled={true} />
                    </Col>
                    <Col>
                        {/* {!props.spanTagAlreadyExist ? ( */}
                        <Button
                            type="primary"
                            onClick={() => {
                                message.config({
                                    top: 380
                                })
                                message.success(t('onBoardingProgress.step1.copied'))
                                copy(copyTextOne);
                            }}
                        ><CopyOutlined /> {t('onBoardingProgress.step1.copy')}</Button>
                        {/* ) : (
                                <img alt="" className="onboarding-Image" src={correctSvg} />
                            )} */}
                    </Col>
                </Row>

                <Row style={{ marginTop: '2.5em' }}>
                    <div className='spantag-instruction-button'>
                        <Button
                            type={'primary'}
                            size="large"
                            style={{ marginLeft: 'auto' }}
                            loading={props.loading}
                            onClick={() => {
                                props.onProgressChange(props.progress + 1);
                            }}
                        >
                            {props.spanTagAlreadyExist
                                ? t('onBoardingProgress.step1.nextCheckSettings')
                                : props.progress < 3 ? t('onBoardingProgress.step1.nextIHaveDoneThis') : t('onBoardingProgress.step1.iHaveDoneThis')}
                        </Button>
                    </div>
                </Row>

            </Card>
        </div>
    );
}
