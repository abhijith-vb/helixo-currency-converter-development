import React, { useState } from 'react';
import exitIntent from 'exit-intent'
import { Modal, Button } from 'antd';
import { storageEngine } from '../../../common/helper/commonMethods';
import http from '../../../common/http/httpProvider';
import Counter from './counter';
import { initChatWidget } from '../../../extras/commonWidgets';

import alphaAd from '../../../images/alpha-ad.png';
import './alpha-ad.scss';

const HIDE_AD = false;

export default function ({ progress }) {
    const [visible, setVisible] = useState(false);

    const removeExitIntent = exitIntent({
        threshold: 5,
        maxDisplays: 1,
        eventThrottle: 100,
        onExitIntent: () => {
            const user = storageEngine.get("user");
            const isNewUser = storageEngine.get("isNewUser");
            console.log('exit-intent triggered');

            const showUfeAd = storageEngine.get('showUfeAd')

            if (!user.ufeClicked && progress >= 3 && showUfeAd && !HIDE_AD) {
                setVisible(true);
                // if (isNewUser && window.fcWidget) initChatWidget(user);
            }
            // setVisible(true);
        }
    })

    const UFE_APP_LINK = 'https://apps.shopify.com/upsell-funnel-engine-upsells?utm_source=bucks-app&utm_medium=banner&utm_campaign=cta';
    const onAdAction = (action = "close") => {
        setVisible(false);
        http.postAction('api/v1/user/adClickTrack', { ufeClicked: true })
            .then((res) => {
                // set property true in local storage
                const user = storageEngine.get("user");
                storageEngine.set("user", {
                    ...user,
                    ufeClicked: true,
                })
                if (action !== 'close') {
                    // redirection link
                    window.open(UFE_APP_LINK)
                }

            })
            .catch((err) => {
                //err
            })
        // setVisible(false);
    }

    return (
        <Modal className="alpha-ad-modal" visible={visible} onCancel={() => onAdAction("close")} footer={null}>
            <a onClick={() => onAdAction("click")} rel="noopener noreferrer" target="_blank">
            </a>
            {/* <Counter /> */}
            <Button style={{ display: 'block', margin: 'auto', padding: '1em 2em', height: 'auto' }} type="primary" size="large" onClick={() => onAdAction("click")}>Add App for FREE</Button>
        </Modal>
    )
}