import React, {useState} from 'react';
import { Card, Typography, Switch, Row, Col, Spin, notification } from 'antd';
import http from '../../../common/http/httpProvider';
import enableSvg from './../../../images/enable-app.svg';
import { useTranslation } from 'react-i18next';
const { Title } = Typography;

export default function (props) {
    const { t } = useTranslation();
    const [appStatusLoading, setAppStatusLoading] = useState(false);

    const openNotificationWithIcon = value => {
        notification['success']({
            message: value ? 'App status enabled' : 'App status disabled',
            duration: 1,
            placement: 'topRight'
        });
    };

    const showModal = () => {
        props.setOnboardingSuccessModal(true);
    };
    return (
        <>
        <div className="onBoardingItem">
            <Card
                title={t('onBoardingProgress.step3.caption')}
                bordered={false}
            >
                <div className="onboardingItem-Content">
                    <div className="onboardingItem-wrap">
                        <img alt="" className="onboarding-Image" src={enableSvg} style={{ width: '350px' }} />
                        <Title level={3}>{t('onBoardingProgress.step3.youAreAlmostDoneEnableAppNow')}</Title>
                        <Row>
                            <Col span={9}/>
                            <Col span={3}>
                                <Title level={4}>{t('settings.header.appStatus')}</Title>
                            </Col>
                            <Col span={2}>
                                <Switch
                                    name="active"
                                    size="large"
                                    className="Status-switch"
                                    checked={props.value.active}
                                    disabled={appStatusLoading}
                                    onChange={change => {
                                                props.progress !== 2 && setAppStatusLoading(true);
                                                const postData = { active: change };
                                                http
                                                .postAction('api/v1/settings/setStatus', postData)
                                                .then(res => {
                                                    openNotificationWithIcon(change);
                                                    props.onChange({
                                                    ...props.value,
                                                    ...{ active: change }
                                                    });
                                                    if (props.progress === 2) {
                                                        props.onProgressChange(props.progress + 1);
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
                            </Col>
                            <Col span={2}>
                                <Spin spinning={appStatusLoading}/>
                            </Col>
                        </Row>
                    </div>
                </div>

            </Card>
        </div>
        </>
    );
}
