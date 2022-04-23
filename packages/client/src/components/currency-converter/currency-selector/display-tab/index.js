import React from 'react';
import { Typography, Row, Col, Select, Switch, Radio, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { Option } = Select;

export default function ({ value = {}, onChange }) {
    const { t } = useTranslation();
    return (
        <>
            <Row className="display-box-heading">
                <Col span={24}>
                    <Text>{t('settings.display.displayDesktop')}</Text>
                </Col>
            </Row>
            <Row className="display-box-display-content">
                <Col span={24} className="currencySelector-text">
                    <Text>{t('settings.display.displayPositionType')}:</Text>
                </Col>
            </Row>
            <Row >
                <Col span={23} className='display-box-radio'>
                    <Radio.Group
                        defaultValue={value.displayPositionType}
                        onChange={newValue => {
                            if (newValue.target.value === 'header') {
                                onChange({
                                    ...value,
                                    ...{ displayPositionType: newValue.target.value },
                                    ...{ customPosition: 'header a[href*="/cart"]' }
                                })
                            }
                            else if (newValue.target.value === 'floating' || newValue.target.value === 'fixedPosition') {
                                onChange({
                                    ...value,
                                    ...{ displayPositionType: newValue.target.value }
                                })
                            }
                        }}>
                        <Radio className="theme-customisation-radio-item" value='floating'>{t('settings.display.floating')}</Radio>
                        <Radio className="theme-customisation-radio-item" value='header'>{t('settings.display.header')}</Radio>
                        <Radio className="theme-customisation-radio-item" value='fixedPosition'>{t('settings.display.fixedPosition')}</Radio>

                    </Radio.Group>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="currencySelector-text">
                    <Text>{(value.displayPositionType === 'floating' && t('settings.display.displayPosition')) ||
                        (value.displayPositionType === 'fixedPosition' && t('settings.display.customCurrencyBoxPosition'))}</Text>
                </Col>
                <Col span={12} className="display-box-positionSelector">
                    {value.displayPositionType === 'floating' &&
                        <Select
                            style={{ width: 140 }}
                            className='display-box-selectbox'
                            optionFilterProp="children"
                            value={value.displayPosition}
                            onChange={newValue => {
                                onChange({
                                    ...value,
                                    ...{ displayPosition: newValue }
                                });
                            }}
                        >
                            <Option value="top_right">{t('settings.display.topRight')}</Option>
                            <Option value="top_left">{t('settings.display.topLeft')}</Option>
                            <Option value="bottom_right">{t('settings.display.bottomRight')}</Option>
                            <Option value="bottom_left">{t('settings.display.bottomLeft')}</Option>
                        </Select>
                    }
                    {value.displayPositionType === 'fixedPosition' && <Input style={{ width: 140 }}
                        value={value.customPosition}
                        placeholder={t('settings.display.customPositionPlaceholder')}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ customPosition: newValue.target.value }
                            })
                        }}
                    />}

                </Col>
                <Col span={12} className="currencySelector-text">
                    <Text>Position Placement</Text>
                </Col>
                <Col span={12} className="display-box-positionSelector">
                    <Select
                        style={{ width: 140 }}
                        className='display-box-selectbox'
                        optionFilterProp="children"
                        value={value.positionPlacement}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ positionPlacement: newValue }
                            });
                        }}
                    >
                        <Option value="after">After</Option>
                        <Option value="before">Before</Option>
                        <Option value="prepend">Prepend</Option>
                        <Option value="append">Append</Option>
                    </Select>
                </Col>

            </Row>
            {/** mobile position */}
            <Row className="display-box-heading">
                <Col span={24}>
                    <Text>{t('settings.display.displayMobile')}</Text>
                </Col>
            </Row>
            <Row className="display-box-display-content">
                <Col span={24} className="currencySelector-text">
                    <Text>{t('settings.display.displayPositionType')}:</Text>
                </Col>
            </Row>
            <Row >
                <Col span={23} className='display-box-radio'>
                    <Radio.Group
                        defaultValue={value.mobileDisplayPositionType}
                        onChange={newValue => {
                            if (newValue.target.value === 'header') {
                                onChange({
                                    ...value,
                                    ...{ mobileDisplayPositionType: newValue.target.value },
                                    ...{ mobileCustomPosition: 'header a[href*="/cart"]' }
                                })
                            }
                            else if (newValue.target.value === 'floating' || newValue.target.value === 'fixedPosition') {
                                onChange({
                                    ...value,
                                    ...{ mobileDisplayPositionType: newValue.target.value }
                                })
                            }
                        }}>
                        <Radio className="theme-customisation-radio-item" value='floating'>{t('settings.display.floating')}</Radio>
                        <Radio className="theme-customisation-radio-item" value='header'>{t('settings.display.header')}</Radio>
                        <Radio className="theme-customisation-radio-item" value='fixedPosition'>{t('settings.display.fixedPosition')}</Radio>

                    </Radio.Group>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="currencySelector-text">
                    <Text>{(value.mobileDisplayPositionType === 'floating' && t('settings.display.displayPosition')) ||
                        (value.mobileDisplayPositionType === 'fixedPosition' && t('settings.display.customCurrencyBoxPosition'))}</Text>
                </Col>
                <Col span={12} className="display-box-positionSelector">
                    {value.mobileDisplayPositionType === 'floating' &&
                        <Select
                            style={{ width: 140 }}
                            className='display-box-selectbox'
                            optionFilterProp="children"
                            value={value.mobileDisplayPosition}
                            onChange={newValue => {
                                onChange({
                                    ...value,
                                    ...{ mobileDisplayPosition: newValue }
                                });
                            }}
                        >
                            <Option value="top_right">{t('settings.display.topRight')}</Option>
                            <Option value="top_left">{t('settings.display.topLeft')}</Option>
                            <Option value="bottom_right">{t('settings.display.bottomRight')}</Option>
                            <Option value="bottom_left">{t('settings.display.bottomLeft')}</Option>
                        </Select>
                    }
                    {value.mobileDisplayPositionType === 'fixedPosition' && <Input style={{ width: 140 }}
                        value={value.mobileCustomPosition}
                        placeholder={t('settings.display.customPositionPlaceholder')}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ mobileCustomPosition: newValue.target.value }
                            })
                        }}
                    />}

                </Col>
                <Col span={12} className="currencySelector-text">
                    <Text>Position Placement</Text>
                </Col>
                <Col span={12} className="display-box-positionSelector">
                    <Select
                        style={{ width: 140 }}
                        className='display-box-selectbox'
                        optionFilterProp="children"
                        value={value.mobilePositionPlacement}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ mobilePositionPlacement: newValue }
                            });
                        }}
                    >
                        <Option value="after">After</Option>
                        <Option value="before">Before</Option>
                        <Option value="prepend">Prepend</Option>
                        <Option value="append">Append</Option>
                    </Select>
                </Col>
            </Row>
            <Row >
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.display.showOriginalPriceOnMouseHover')}</Text>
                </Col>
                <Col span={12} className="currencySelector-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.showOriginalPriceOnMouseHover}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ showOriginalPriceOnMouseHover: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
            {/** Drop down menu direction */}
            <Row className="display-box-heading mt-10">
                <Col span={24}>
                    <Text>{t('settings.display.customDropdownCurrencyListPlacement')}</Text>
                </Col>
            </Row>
            <Row >
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.display.customOptionPlacement')}</Text>
                </Col>
                <Col span={12} className="currencySelector-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.customOptionsPlacement}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ customOptionsPlacement: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
            {value.customOptionsPlacement &&
                <Row >
                    <Col span={12} className="currencySelector-text">
                        <Text>{t('settings.display.optionPlacementType')}</Text>
                    </Col>
                    <Col span={12} className="display-box-positionSelector">
                        <Select
                            style={{ width: 140 }}
                            className='display-box-selectbox'
                            optionFilterProp="children"
                            value={value.optionsPlacementType}
                            onChange={newValue => {
                                onChange({
                                    ...value,
                                    ...{ optionsPlacementType: newValue }
                                });
                            }}
                        >
                            <Option value="left_upwards">Left Upwards</Option>
                            <Option value="right_upwards">Right Upwards</Option>
                            <Option value="left_downwards">Left Downwards</Option>
                            <Option value="right_downwards">Right Downwards</Option>
                        </Select>
                    </Col>
                </Row>}
            {/**for mobile */}
            <Row >
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.display.customOptionPlacementMobile')}</Text>
                </Col>
                <Col span={12} className="currencySelector-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.customOptionsPlacementMobile}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ customOptionsPlacementMobile: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
            {value.customOptionsPlacementMobile &&
                <Row >
                    <Col span={12} className="currencySelector-text">
                        <Text>{t('settings.display.optionPlacementTypeMobile')}</Text>
                    </Col>
                    <Col span={12} className="display-box-positionSelector">
                        <Select
                            style={{ width: 140 }}
                            className='display-box-selectbox'
                            optionFilterProp="children"
                            value={value.optionsPlacementTypeMobile}
                            onChange={newValue => {
                                onChange({
                                    ...value,
                                    ...{ optionsPlacementTypeMobile: newValue }
                                });
                            }}
                        >
                            <Option value="left_upwards">Left Upwards</Option>
                            <Option value="right_upwards">Right Upwards</Option>
                            <Option value="left_downwards">Left Downwards</Option>
                            <Option value="right_downwards">Right Downwards</Option>
                        </Select>
                    </Col>
                </Row>}
            {/** ends */}
            <Row className="display-box-heading">
                <Col span={24}>
                    <Text>{t('settings.display.sub')}</Text>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.display.showInDesktop')}</Text>
                </Col>
                <Col span={12} className="currencySelector-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.showInDesktop}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ showInDesktop: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12} className="currencySelector-text">
                    <Text>{t('settings.display.showInMobileDevice')}</Text>
                </Col>
                <Col span={12} className="currencySelector-switch">
                    <Switch
                        size="small"
                        className="Status-switch"
                        checked={value.showInMobileDevice}
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ showInMobileDevice: newValue }
                            });
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24} className="currencySelector-text">
                    <Text className='display-proTip'>{t('settings.display.proTip')}</Text>
                </Col>
            </Row>
        </>
    )
}