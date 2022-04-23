import React, { useEffect, useState } from 'react';
import { Tabs, Typography, Row, Col, Radio } from 'antd';
import { PicLeftOutlined, BgColorsOutlined, DesktopOutlined } from '@ant-design/icons';
import ThemeTab from './theme-tab';
import GeneralTab from './general-tab';
import DisplayTab from './display-tab';
import PreviewIframe from '../../../common/preview-iframe';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { Text } = Typography;

export default function ({ value = {}, onChange, userData }) {
    const { t } = useTranslation();
    const [previewDevice, setPreviewDevice] = useState('desktop')

    useEffect(() => {
        encodeAndSendToPreview('preview', userData)
    }, [userData]);
    /**
     * 
     * @param {*} action preview
     * @param {*} data new settings
     * for posting data to widgets
     */
    const encodeAndSendToPreview = (action, data) => {
        const previewFrame = document.getElementById('preview-page');
        // Add isDemoMode flag to data
        data.demoMode = true;
        const newSettings = {
            action,
            data: JSON.stringify(data)
        }
        console.log(data)

        previewFrame.contentWindow.postMessage(newSettings, '*')
    }
    return (
        <div className="currencySelector-main hxoPolaris-Card">
            <Row>
                <Col md={12} sm={24}>
                    <Tabs>
                        <TabPane tab={<span><PicLeftOutlined /> {t('settings.currencySelector.general')}</span>} key="1">
                            <GeneralTab value={value} onChange={onChange} />
                        </TabPane>
                        <TabPane tab={<span><BgColorsOutlined /> {t('settings.theme.theme')}</span>} key="2">
                            <ThemeTab value={value} onChange={onChange} userData={userData} />
                        </TabPane>
                        <TabPane tab={<span><DesktopOutlined />{t('settings.display.display')}</span>} key="3">
                            <DisplayTab value={value} onChange={onChange} />
                        </TabPane>
                    </Tabs>
                </Col>
                <Col md={12} sm={24} className='theme-customisation-preview-col'>
                    <Row className='theme-customisation-preview-switch'>
                        <Radio.Group

                            onChange={(e) => {
                                setPreviewDevice(e.target.value)
                                // eslint-disable-next-line default-case
                                switch (e.target.value) {
                                    case 'mobile': {
                                        const viewport = document.querySelector("meta[name=viewport]");
                                        viewport.setAttribute('content', 'width=480')
                                        console.log(viewport.getAttribute('content'))
                                        break;
                                    }
                                    case 'desktop': {
                                        const viewport = document.querySelector("meta[name=viewport]");
                                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
                                        console.log(viewport.getAttribute('content'))
                                        break;
                                    }
                                }
                            }} value={previewDevice}>
                            <Radio.Button value="desktop">Desktop</Radio.Button>
                            <Radio.Button value="mobile">Mobile</Radio.Button>
                        </Radio.Group>
                    </Row>
                    <div className='theme-customisation-iframe-col'>
                        <div className={previewDevice === 'mobile' ? "smartphone" : "holder"}>
                            <div className={previewDevice === 'mobile' ? "content" : "preview"}>
                                <PreviewIframe
                                    encodeAndSendToPreview={encodeAndSendToPreview}
                                    userData={userData}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

        </div>
    );
}
