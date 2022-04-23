import React, { useState, useEffect } from 'react';
import { storageEngine } from './../helper/commonMethods';
import CongratzModal from './modal-congratz';
import TestAppModal from './modal-test-app';
export default function (props) {
    //console.log('from modals',props.visible)
    const [visible, setVisibility] = useState(props.visible);
    const [callbackVisibility, setCallbackVisibility] = useState(false);
    const [callbackStatus, setCallBackStatus] = useState('callback');
    useEffect(() => {
        setVisibility(props.visible)
    }, [props.visible])
    /**
     * handling 'Test your app in store' button
     */
    const handleButtonClick = () => {
        setVisibility(false);
        setCallbackVisibility(true);
        const { myshopify_domain } = storageEngine.get('user');
        const gotoDomain = `//${myshopify_domain}/collections/all?merchant=true`;
        window.open(gotoDomain);
    };
    const handleCancel = () => {
        setVisibility(false);
    };
    const handleFeedbackSubmit = e => {
        console.log(e.target.feedback.value);
        setCallbackVisibility(false);
    };
    return (
        <>
            <CongratzModal visible={visible} handleButtonClick={handleButtonClick} handleCancel={handleCancel} />
            <TestAppModal callbackVisibility={callbackVisibility}
                callbackStatus={callbackStatus}
                setCallBackStatus={setCallBackStatus}
                setCallbackVisibility={setCallbackVisibility}
                handleFeedbackSubmit={handleFeedbackSubmit}
                setFeedbackOnboarding={props.setFeedbackOnboarding}
                form={props.form}
            />
        </>
    )
}