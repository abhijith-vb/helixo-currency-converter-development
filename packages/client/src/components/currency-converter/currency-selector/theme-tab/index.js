import React, { useState, useEffect } from 'react';
import { Row, Col, Radio, Popover, Button, Typography, Select, Switch } from 'antd';
import { ChromePicker } from 'react-color';
import PreviewIframe from '../../../../common/preview-iframe';
import darkModeImg from '../../../../images/darkMode.png';
import { useTranslation } from 'react-i18next';
const { Text, Title } = Typography;
const { Option } = Select;
export default function ({ value = {}, onChange, userData }) {
    const [backgroundColor, setBackgroundColor] = useState(value.backgroundColor);
    const [textColor, setTextColor] = useState(value.textColor);
    const [hoverColor, setHoverColor] = useState(value.hoverColor);
    const [previewDevice, setPreviewDevice] = useState('desktop')
    const { t } = useTranslation();
    useEffect(() => {
        encodeAndSendToPreview('preview', userData)
    }, [userData])
    /**
     * 
     * @param {*} action preview
     * @param {*} data new settings
     * for posting data to widgets
     */
    const encodeAndSendToPreview = (action, data) => {
        const previewFrame = document.getElementById('preview-page')
        const newSettings = {
            action,
            data: JSON.stringify(data)
        }
        previewFrame.contentWindow.postMessage(newSettings, '*')
    }

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
                        ...{ backgroundColor: color.rgb }
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
                        ...{ textColor: color.rgb }
                    });
                }}
            />
        </div>
    );
    const contentHover = (
        <div className="theme-customisation-colorpicker">
            <ChromePicker
                color={hoverColor}
                onChange={(color, event) => {
                    setHoverColor(color.rgb)
                }}
                onChangeComplete={(color, event) => {
                    //console.log(color.hex);
                    onChange({
                        ...value,
                        ...{ hoverColor: color.rgb }
                    });
                }}
            />
        </div>
    );
    return (<>
        <div className="theme-customisation-main">
            <Row className='margin-bottom-10'>
                <Col span={24} className="theme-customisation-theme-selection">
                    <div className="display-box-heading margin-bottom-10">
                        <Text>{t('settings.theme.currencyBoxTheme')}</Text>
                    </div>
                    <Radio.Group
                        name="radiogroup"
                        defaultValue={value.themeType}
                        className="theme-customisation-radio"
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ themeType: newValue.target.value }
                            });
                        }}
                    >
                        <Radio
                            value="default"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.theme.default')}
                        </Radio>
                        <Radio
                            value="modernLayered"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.theme.modernLayers')}
                        </Radio>
                    </Radio.Group>
                </Col>
            </Row>
            <Row>
                <Col span={24} className="theme-customisation-theme-selection">
                    <div className="display-box-heading margin-bottom-10">
                        <Text>{t('settings.theme.flagStyle')}</Text>
                    </div>
                    <Radio.Group
                        name="radiogroup"
                        defaultValue={value.flagStyle}
                        className="theme-customisation-radio margin-bottom-10"
                        onChange={newValue => {
                            onChange({
                                ...value,
                                ...{ flagStyle: newValue.target.value }
                            });
                        }}
                    >
                        <Radio
                            value="traditional"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.theme.traditionalFlags')}
                        </Radio>
                        <Radio
                            value="modern"
                            className="theme-customisation-radio-item"
                        >
                            {t('settings.theme.modernFlags')}
                        </Radio>
                    </Radio.Group>
                    <Row align="middle">
                        <Col span={8}>
                            <Text>{t('settings.theme.flagTheme')}</Text>
                        </Col>
                        <Col span={16} className='display-box-radio'>
                            <Select value={value.flagTheme}
                                onChange={newValue => {
                                    onChange({
                                        ...value,
                                        ...{ flagTheme: newValue }
                                    })
                                }}>
                                <Option value='rounded'>{t('settings.theme.rounded')}</Option>
                                <Option value='circle'>{t('settings.theme.circle')}</Option>
                                <Option value='flat'>{t('settings.theme.flat')}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row align="middle" >
                        <Col span={15}>
                            <Text>{t('settings.theme.flagDisplayOption')}</Text>
                        </Col>
                        <Col span={16} className='display-box-radio'>
                            <Select value={value.flagDisplayOption}
                                onChange={newValue => {
                                    onChange({
                                        ...value,
                                        ...{ flagDisplayOption: newValue }
                                    })
                                }}>
                                <Option value='showFlagAndCurrency'>{t('settings.theme.showFlagAndCurrency')}</Option>
                                <Option value='showFlagOnly'>{t('settings.theme.showFlagOnly')}</Option>
                                <Option value='showCurrencyOnly'>{t('settings.theme.showCurrencyOnly')}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row justify="space-between" className="borderBox">
                        <div className="boxChild">
                            <Text>{t('settings.theme.showCurrencyCodesOnly')}</Text>

                        </div>
                        <div className="boxChild">
                            <Switch
                                size="small"
                                className="Status-switch"
                                checked={value.showCurrencyCodesOnly}
                                onChange={newValue => {
                                    onChange({
                                        ...value,
                                        ...{ showCurrencyCodesOnly: newValue }
                                    });
                                }}
                            />
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row align="middle" justify="space-between" className='margin-bottom-10 borderBox switchShadowWrapper'
                style={{ backgroundImage: `url(${darkModeImg})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat', backgroundPositionY: '-18px', height: '135px' }}
            >
                <Col span={24}>
                    <div className="display-box-heading">
                        <Row align="middle" justify="start">
                            <div className="display-box-heading">
                                <Title level={4} style={{ color: '#fff', marginRight: '1em' }}>{t('settings.theme.darkMode')}</Title>
                            </div>
                            <div style={{ marginBottom: '0.5em' }}>
                                <Switch size="large"
                                    checked={value.darkMode}
                                    onChange={(newValue) => {
                                        onChange({
                                            ...value,
                                            ...{ darkMode: newValue }
                                        })
                                    }
                                    } />
                            </div>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24} className="theme-customisation-set">
                    <div className="display-box-heading margin-bottom-10">
                        <Text>{t('settings.theme.themeCustomisation')}</Text>
                    </div>
                    <Row align="middle" >
                        <Col span={8}>
                            <Text>{t('settings.theme.borderStyle')}</Text>
                        </Col>
                        <Col span={16} className='display-box-radio'>
                            <Select value={value.borderStyle}
                                onChange={newValue => {
                                    onChange({
                                        ...value,
                                        ...{ borderStyle: newValue }
                                    })
                                }}>
                                <Option value='boxShadow'>{t('settings.theme.boxShadow')}</Option>
                                <Option value='borderLine'>{t('settings.theme.borderLine')}</Option>
                                <Option value='noBorder'>{t('settings.theme.noBorder')}</Option>
                            </Select>
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
                    <Row align="middle" justify="center" className="theme-customisation-single-row">
                        <Col span={20}>
                            <Text>{t('settings.theme.hoverColor')}</Text>
                        </Col>
                        <Col span={4}>
                            <Popover
                                placement="bottom"
                                content={contentHover}
                                trigger="click"
                            >
                                <Button
                                    block
                                    style={{
                                        backgroundColor: `rgb(${hoverColor.r},${hoverColor.g},${hoverColor.b},${hoverColor.a})`
                                    }}
                                ></Button>
                            </Popover>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </>
    );
}
