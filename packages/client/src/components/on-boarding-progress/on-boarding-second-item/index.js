/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Card, Typography, Button } from 'antd';
import checkSettingsSvg from './../../../images/check-settings.svg';
import { useTranslation } from 'react-i18next';
const { Title } = Typography;
export default function (props) {
    const { t } = useTranslation();
    return (
        <div className="onBoardingItem">
            <Card
                title={t('onBoardingProgress.step2.caption')}
                bordered={false}
            >
                <div className="onboardingItem-Content">
                    <div className="onboardingItem-wrap">
                        <img alt="" className="onboarding-Image margin-bottom-20" src={checkSettingsSvg} style={{ width: '350px' }} />
                        <Title className="margin-top-20" level={2}>{t('onBoardingProgress.step2.checkTheBelowSettingsAndSave')}</Title>
                        <Button
                            style={{ padding: '14px 42px', height: 'auto' }}
                            type="primary"
                            loading={props.loading}
                            size="large"
                            htmlType="submit"
                        >
                            {t('settings.header.save')}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
