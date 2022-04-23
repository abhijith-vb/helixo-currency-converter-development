import React from 'react';
import { Row, Col, Typography, Switch, Input, Radio, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
export default function ({ value = {}, onChange }) {
    const { t } = useTranslation();
    const handleInputBox = e => {
        const amount = e.target.value;
        //console.log(amount*100)
        if (
            ((amount > 0 && amount < 1) || amount === '0.0' || amount === '0.00') &&
            amount.match(/^\d{1,}(\.\d{0,2})?$/)
        ) {
            onChange({
                ...value,
                ...{ roundingDecimal: amount }
            });
            // amount === '0.0'
            //     ? setError(t('settings.priceDisplayOption.roundingDecimalNotEqualToZero'))
            //     : setError(' ');
        } else if (amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
            onChange({
                ...value,
                ...{ roundingDecimal: '0.' }
            });
            // setError(t('settings.priceDisplayOption.roundingDecimalNotEqualToZero'));
        }
    };
    return (
        <div className="display-box currencySelector-main hxoPolaris-Card">
            <Row>
                <Col span={24} className="display-box-heading">
                    <Text>{t('settings.priceDisplayOption.priceDisplayOption')}</Text>
                </Col>
            </Row>
            {/*<Row>
                <Col span={6} className="round-decimal-text">
                    <Text>{t('settings.priceDisplayOption.roundDecimalDigits')}</Text>
                </Col>
                <Col span={18} className="round-decimal-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.roundPriceStatus}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ roundPriceStatus: newValue }
                            });
                            
                        }}
                    />
                </Col>
                    </Row>*/}
            <Row>
                <Col span={24} className="round-decimal-info">
                    <Radio.Group
                        name="radiogroup"
                        value={value.priceRoundingType}
                        className="theme-customisation-radio"
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ priceRoundingType: newValue.target.value }
                            });
                        }}
                    >
                        <Radio
                            value="roundToDecimal"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.priceDisplayOption.roundToDecimal')}
                        </Radio>
                        <Radio
                            value="removeDecimal"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.priceDisplayOption.removeDecimal')}
                        </Radio>
                        <Radio
                            value="none"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.priceDisplayOption.none')}
                        </Radio>
                    </Radio.Group>
                </Col>
            </Row>
            {value.priceRoundingType !== 'none' && <>
                <Row>
                    <Col span={12} className="round-decimal-text">
                        <Text>{t('settings.priceDisplayOption.enablePriceRounding')}</Text>
                    </Col>
                    <Col span={12} className="round-decimal-switch">
                        <Switch
                            size="small"
                            className="Status-switch"
                            checked={value.defaultCurrencyRounding}
                            onChange={newValue => {
                                onChange({
                                    ...value,
                                    ...{ defaultCurrencyRounding: newValue }
                                });

                            }}
                        />
                    </Col>
                </Row>

                {value.priceRoundingType !== 'removeDecimal' && <>
                    <Row>
                        <Col span={6} className="round-decimal-text">
                            <Text>{t('settings.priceDisplayOption.roundingDecimal')}</Text>
                        </Col>
                        <Col span={18} className="round-decimal-input">
                            <Input
                                value={value.roundingDecimal === 0 ? '0.00' : value.roundingDecimal}
                                onChange={handleInputBox}
                            />
                            {/*<Text type="danger">{error}</Text>*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className="round-decimal-info">
                            <p>{t('settings.priceDisplayOption.exampleText', {
                                val:
                                    value.priceRoundingType === 'roundToDecimal'
                                        ? value.roundingDecimal * 100 < 9
                                            ? `0${value.roundingDecimal * 100}`
                                            : value.roundingDecimal.toString().replace('0.', '')
                                        : '61'
                            })}</p>
                        </Col>
                    </Row>
                </>}
                <Alert className="mt-10" type="info" message={
                    <>
                        <b>NOTE: </b> If your store is Shopify Payments multi-currency enabled then, our app can't do rounding. Please refer <a href="https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency/conversions#automatic-conversions-and-rounding-rules" target="_blank">Shopify Rounding Rules</a>
                    </>
                }>
                </Alert>
            </>}
        </div>
    );
}
