import React, { useState } from 'react';
import { Typography, Row, Col, Select, Switch, Button, Alert } from 'antd';
import { storageEngine } from '../../../../common/helper/commonMethods';
import { currencies } from '../../../../common/currencies';
import { useTranslation } from 'react-i18next';
import geolocationImg from '../../../../images/geolocation.png';

const { Text, Paragraph } = Typography;
const { Option } = Select;

export default function ({ value = {}, onChange, userData }) {
    const { t } = useTranslation();
    const [selectall, setSelectAll] = useState('  ');
    const [error, setError] = useState(null);

    const user = storageEngine.get('user');

    const { eligible_for_payments: eligibleForPayments } = user;

    return (
        <>
            <Row>
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.currencySelector.selectCurrencies')}</Text>
                </Col>
                <Col span={12} className="currencySelector-selectall">
                    <Button
                        block
                        onClick={() => {
                            if (selectall) {
                                onChange({
                                    ...value,
                                    ...{
                                        selectedCurrencies: currencies
                                    }
                                });
                                setSelectAll(false);
                                setError('');
                            } else {
                                onChange({
                                    ...value,
                                    ...{ selectedCurrencies: [] }
                                });
                                setSelectAll(true);
                                setError('Please select atleast one currency');
                            }
                        }}
                    >
                        {selectall ? t('settings.currencySelector.selectAll') : t('settings.currencySelector.deselectAll')}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Select
                        mode="multiple"
                        style={{
                            width: '100%',
                            maxHeight: '170px',
                            overflowY: 'scroll',
                            overflowX: 'hidden'
                        }}
                        placeholder="Please select"
                        value={value.selectedCurrencies.map(currency =>
                            JSON.stringify(currency)
                        )}
                        onChange={newValue => {
                            newValue.length === 0
                                ? setError(t('settings.currencySelector.pleaseSelectAtleastOneCurrency'))
                                : setError(' ');
                            onChange({
                                ...value,
                                ...{
                                    selectedCurrencies: newValue.map(currency =>
                                        JSON.parse(currency)
                                    )
                                }
                            });
                        }}
                    >
                        {currencies.map((currency, index) => {
                            return (
                                <Option key={index} value={JSON.stringify(currency)}>
                                    {Object.values(currency)[0]}
                                </Option>
                            );
                        })}
                    </Select>
                    <Text type="danger">{error}</Text>
                </Col>
            </Row>
            <Row align="middle" justify="end" className="borderBox switchShadowWrapper" style={{ backgroundImage: `url(${geolocationImg})`, backgroundSize: '177px', backgroundRepeat: 'no-repeat', height: '110px' }}>
                <div className="boxChild" style={{ padding: '0.7em 0.1em .7em 1em', borderRadius: '100px' }}>
                    <Text>{t('settings.currencySelector.autoSwitchCurrencyBasedOnLocation')}</Text>
                </div>
                <div className="boxChild">
                    <Switch
                        size="large"
                        className="Status-switch"
                        checked={value.autoSwitchCurrencyLocationBased}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ autoSwitchCurrencyLocationBased: newValue }
                            });
                        }}
                    />
                </div>
            </Row>
            <Row justify="space-between" className="borderBox">
                <div className="boxChild">
                    <Text>{t('settings.currencySelector.convertCurrencyToNonListed')}</Text>
                    <span className="boxChild-disc" dangerouslySetInnerHTML={{ __html: t('settings.currencySelector.convertCurrencyToNonListedDisc') }} ></span>
                </div>
                <div className="boxChild">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.autoSwitchOnlyToPreferredCurrency}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ autoSwitchOnlyToPreferredCurrency: newValue }
                            });
                        }}
                    />
                </div>
            </Row>
            <Row justify="space-between" className="borderBox">
                <div className="boxChild">
                    <Text>{t('settings.currencySelector.showCurrencySymbol')}</Text>
                    <span className="boxChild-disc">{t('settings.currencySelector.showCurrencySymbolEg1')}
                        <p>{t('settings.currencySelector.showCurrencySymbolEg2')}</p></span>
                </div>
                <div className="boxChild">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.moneyWithCurrencyFormat}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ moneyWithCurrencyFormat: newValue }
                            });
                        }}
                    />
                </div>
            </Row>
            {eligibleForPayments && value.moneyWithCurrencyFormat && <Row>
                <Alert type="warning" message="NOTE: This option will not work with shopify payments" style={{ marginTop: '5px' }} banner />
            </Row>}
        </>
    )
}