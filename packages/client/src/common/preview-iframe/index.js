import React from 'react';
import Iframe from 'react-iframe';
import { formatInitialData } from '../common-methods'
export default function ({ encodeAndSendToPreview, userData }) {
    return (
        <>
            <Iframe
                url="/pages/demo/"
                id="preview-page"
                className='preview-iframe'
                height="100%"
                width="100%"
                frameBorder={8}
                onLoad={() => {
                    const previewFrame = document.getElementById('preview-page')
                    const formattedDate = formatInitialData(userData)
                    const newSettings = {
                        action: 'preview',
                        data: JSON.stringify(formattedDate)
                    }
                    previewFrame.contentWindow.postMessage(newSettings, '*')

                }}
            />
        </>
    )
}