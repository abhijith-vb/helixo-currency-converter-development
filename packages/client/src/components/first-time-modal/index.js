import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { storageEngine } from '../../common/helper/commonMethods';
import helloSvg from '../../images/hello.svg';
import './style.scss';

const { Text } = Typography;

export default function ({ visible, setVisible }) {

    const user = storageEngine.get('user') || {};
    const { eligible_for_payments } = user;

    return (
        <Modal
            visible={visible}
            footer={null}
            closable={false}
        >
            <div className="first-time-modal">
                <div>
                    <img style={{ width: '350px', margin: 0 }} alt="" className="onboarding-Image margin-bottom-20" src={helloSvg} />
                </div>
                <div>
                    <p>Hello {user.name || ''},</p>
                    {!eligible_for_payments && <p className="ufe-notice"><b>NOTE:</b> Currency conversion in CHECKOUT PAGE is only available in Shopify Payments <a href="https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency/setup" target="_blank">Shopify multi-currency</a> as per Shopify policies!</p>}

                    <p><Text strong >Important:</Text> Don't use <Text strong >MULTIPLE CURRENCY CONVERTER</Text> apps at the same time - Uninstall / Disable them!! Otherwise it will result wrong prices!!</p>


                    <p>- Helixo Team</p>
                </div>
                <div>
                    <Button type="primary" size="large" onClick={() => setVisible(false)}>I understand</Button>
                </div>
            </div>
        </Modal>
    )
}