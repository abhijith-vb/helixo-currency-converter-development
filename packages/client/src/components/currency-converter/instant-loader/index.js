import React, { useState } from 'react';
import { Row, Col, Typography, Switch, notification, Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import http from '../../../common/http/httpProvider';

const { Text } = Typography;
export default function ({ value = {}, onChange, newUser }) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    return (
        <Spin spinning={loading}>
            <div className="display-box currencySelector-main hxoPolaris-Card">
                <Row>
                    <Col span={5}>
                        <Text>{t('settings.activateInstantLoader.instantLoader')}</Text>
                    </Col>
                    <Col span={19}>
                        <Switch
                            size="small"
                            checked={value.instantLoader}
                            onChange={newValue => {
                                setLoading(true);
                                if (!newUser) {
                                    http
                                        .postAction('api/v1/settings/instantLoader', { active: newValue })
                                        .then(res => {
                                            onChange({
                                                ...value,
                                                ...{ instantLoader: newValue }
                                            });
                                            notification.success({
                                                message: newValue ? t('settings.activateInstantLoader.activate') : t('settings.activateInstantLoader.deactivate')
                                            })
                                            setLoading(false)
                                        })
                                        .catch(error => {
                                            const { message = t('settings.activateInstantLoader.error') } = error;
                                            notification.error({
                                                message
                                            });
                                            setLoading(false)
                                        });
                                }
                                else {
                                    onChange({
                                        ...value,
                                        ...{ instantLoader: newValue }
                                    });
                                    // notification.success({
                                    //     message: newValue ? t('settings.activateInstantLoader.activate') : t('settings.activateInstantLoader.deactivate')
                                    // })
                                    setLoading(false)
                                }
                            }}
                        />
                    </Col>
                </Row>
                {
                    <Row>
                        <Col >
                            <Alert type="warning" message={t('settings.activateInstantLoader.alert')} style={{ marginTop: '5px' }} banner />
                        </Col>
                    </Row>
                }
            </div>
        </Spin>

    )
}