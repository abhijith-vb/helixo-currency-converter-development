import React from 'react';
import copy from 'copy-to-clipboard';
import { Row, Col, Typography, Input, Button,message } from 'antd';
import { useTranslation } from 'react-i18next';
import { CopyOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const TEXT_ONE = "<div class='buckscc-currency-box'></div>";
const TEXT_TWO = "<div class='buckscc-cart-banner'></div>";
export default function ({ value, onChange }) {
    const { t } = useTranslation();
    return (
        <div className="display-box currencySelector-main hxoPolaris-Card">
            <Row>
                <Col span={24} className="display-box-heading">
                    <Text>{t('settings.customPosition.title')}</Text>
                </Col>
            </Row>
            <Row>
                <Col span={24} className="currencySelector-text">
                    <Title level={4}>{t('settings.customPosition.currencyConverterBoxPlacement')}</Title>
                </Col>
            </Row>
            <Row className="advanced-custom-css">
                <Col span={8} >
                    <Input value={TEXT_ONE} />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => {
                            message.config({
                                top: 310
                        })
                        message.success(t('onBoardingProgress.step1.copied'))
                        copy(TEXT_ONE);
                    }}
                    >
                        <CopyOutlined /> {t('onBoardingProgress.step1.copy')}
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: '1em' }}>
                <Col span={24} className="currencySelector-text">
                    <Title level={4}>{t('settings.customPosition.cartBannerPlacement')}</Title>
                </Col>
            </Row>
            <Row className="advanced-custom-css">
                <Col span={8} >
                    <Input value={TEXT_TWO} />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => {
                            message.config({
                                top: 310
                        })
                        message.success(t('onBoardingProgress.step1.copied'))
                        copy(TEXT_TWO);
                    }}
                >
                        <CopyOutlined /> {t('onBoardingProgress.step1.copy')}
                    </Button>
                </Col>
            </Row>
        </div>
    )
}