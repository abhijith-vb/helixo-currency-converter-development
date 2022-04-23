import React from 'react';
import { Typography, Button } from 'antd';

import './styles.scss';
import ufeLogo from '../../../images/ufe-logo.svg';

const { Title } = Typography;

export default function () {
    return (
        <div className="display-box currencySelector-main hxoPolaris-Card buckscc-ad__ufe">
            <Title level={2}>Are you selling and not upselling?</Title>

            <Title level={4}>You are leaving money on the table!!</Title>

            <p>Do upselling is awesome, but make sales funnels out of it is <b>Sooooper Awesome!!</b></p>

            <p><a href="https://apps.shopify.com/upsell-funnel-engine-upsells?utm_source=bucks-app&utm_medium=banner&utm_campaign=cta" target="_blank"><img src={ufeLogo} /></a></p>

            <Button className="uheartbeat" style={{ margin: '20px 0' }} type="primary" size="large"><a href="https://apps.shopify.com/upsell-funnel-engine-upsells?utm_source=bucks-app&utm_medium=banner&utm_campaign=cta" target="_blank">Add App (100% FREE)</a></Button>

            <p>🔥 &nbsp; Proven 2x revenue UPSELL FUNNELS app!</p>
            <p>⭐ &nbsp; Trusted by 5000+ merchants!</p>
        </div>
    )
}