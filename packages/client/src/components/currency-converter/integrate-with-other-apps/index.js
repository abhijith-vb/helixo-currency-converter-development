import React from 'react';
import { Typography, Row, Col, Switch } from 'antd';

const { Text } = Typography;

export default function ({ value = {}, onChange }) {
    return (
        <div className="currencySelector-main hxoPolaris-Card">
            <Row>
                <Col span={24} className="display-box-heading">
                    <Text>Integrate with other Apps</Text>
                </Col>
            </Row>
            <Row>
                <Col span={6} className="round-decimal-text">
                    <Text>Integrate upsell funnel Engine Apps:</Text>
                </Col>
                <Col span={18} className="round-decimal-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.integrateWithOtherApps}
                        onChange={newValue => {
                            onChange({
                                ...{ integrateWithOtherApps: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}
