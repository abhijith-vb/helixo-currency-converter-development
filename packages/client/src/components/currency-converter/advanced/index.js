import React from 'react';
import { Row, Col, Typography, Input } from 'antd';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;
export default function ({ value, onChange }) {
    const { t } = useTranslation();
    return (
        <div className="display-box currencySelector-main hxoPolaris-Card">
            <Row>
                <Col span={24} className="display-box-heading">
                    <Text>{t('settings.advanced.title')}</Text>
                </Col>
            </Row>
            <Row >
                <Col span={4} className="currencySelector-text">
                    <Text>{t('settings.advanced.customCSS')}:</Text>
                </Col>
            </Row>
            <Row className="advanced-custom-css">
                <Col span={24} >
                    <Input.TextArea rows="5" value={value.expertSettings.css} onChange={(e) => {
                        onChange({
                            ...value,
                            ...{
                                expertSettings: {
                                    ...value.expertSettings,
                                    ...{ css: e.target.value }
                                }
                            }
                        })
                    }} />
                </Col>
            </Row>
            <Row >
                <Col span={4} className="currencySelector-text">
                    <Text>{t('settings.advanced.customTrigger')}:</Text>
                </Col>
            </Row>
            <Row className="advanced-custom-trigger">
                <Col span={24} >
                    <Input.TextArea rows="5" value={value.trigger} onChange={(e) => {
                        onChange({
                            ...value,
                            ...{
                                trigger:  e.target.value 
                                
                            }
                        })
                    }} />
                </Col>
            </Row>
        </div>
    )
}