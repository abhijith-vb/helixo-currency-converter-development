import React, { useState } from 'react';
import { Typography, Row, Col, Switch, Input, Button, Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChromePicker } from 'react-color';
const { Text } = Typography;

export default function ({ value = {}, onChange }) {
    const { t } = useTranslation();
    const [backgroundColor, setBackgroundColor] = useState(value.cartNotificationBackgroundColor);
    const [textColor, setTextColor] = useState(value.cartNotificationTextColor);
    const contentBackground = (
        <div className="theme-customisation-colorpicker">
            <ChromePicker
                color={backgroundColor}
                onChange={(color, event) => {
                    setBackgroundColor(color.rgb)
                }}
                onChangeComplete={color => {
                    //console.log(color.rgb);
                    onChange({
                        ...value,
                        ...{ cartNotificationBackgroundColor: color.rgb }
                    });
                }}
            />
        </div>
    );
    const contentText = (
        <div className="theme-customisation-colorpicker">
            <ChromePicker
                color={textColor}
                onChange={(color, event) => {
                    setTextColor(color.rgb)
                }}
                onChangeComplete={(color, event) => {
                    //console.log(color.hex);
                    onChange({
                        ...value,
                        ...{ cartNotificationTextColor: color.rgb }
                    });
                }}
            />
        </div>
    );
    return (
        <div className="display-box currencySelector-main hxoPolaris-Card">
            <Row>
                <Col span={24} className="notification-box">
                    <Row className="display-box-heading">
                        <Col span={24}>
                            <Text>{t('settings.display.notification')}</Text>
                        </Col>
                    </Row>
                    <Row className="display-box-display-content">
                        <div className="currencySelector-text">
                            <Text>{t('settings.display.displayCartNotification')}</Text>
                        </div>
                        <div span={12} className="currencySelector-switch">
                            <Switch
                                size="small"
                                className="Status-switch"
                                checked={value.cartNotificationStatus}
                                onChange={newValue => {
                                    onChange({
                                        ...value,
                                        ...{ cartNotificationStatus: newValue }
                                    });
                                }}
                            />
                        </div>
                    </Row>
                    <Row className="notification-switch-info">
                        <p>{t('settings.display.showCheckoutCurrencyNotificationInCart')}</p>
                    </Row>
                    <Row>
                        <Col span={24} className="notification-editor">
                            <Input.TextArea
                                value={value.cartNotificationMessage}
                                onChange={(event) => {
                                    const data = event.target.value;
                                    onChange({
                                        ...value,
                                        ...{ cartNotificationMessage: data }
                                    });
                                }}
                                disabled={!value.cartNotificationStatus}
                            />
                        </Col>
                    </Row>
                    <Row align="middle" justify="center" className="theme-customisation-single-row">
                        <Col span={20}>
                            <Text>{t('settings.theme.backgroundColor')}</Text>
                        </Col>
                        <Col span={4}>
                            <Popover
                                placement="bottom"
                                content={contentBackground}
                                trigger="click"
                            >
                                <Button
                                    block
                                    style={{
                                        backgroundColor: `rgb(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`
                                    }}
                                ></Button>
                            </Popover>
                        </Col>
                    </Row>
                    <Row align="middle" justify="center" className="theme-customisation-single-row">
                        <Col span={20}>
                            <Text>{t('settings.theme.textColor')}</Text>
                        </Col>
                        <Col span={4}>
                            <Popover
                                placement="bottom"
                                content={contentText}
                                trigger="click"
                            >
                                <Button
                                    block
                                    style={{
                                        backgroundColor: `rgb(${textColor.r},${textColor.g},${textColor.b},${textColor.a})`
                                    }}
                                ></Button>
                            </Popover>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
