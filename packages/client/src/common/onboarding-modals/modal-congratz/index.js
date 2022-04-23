import React from 'react';
import successSvg from '../../../images/celebration.svg';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Modal } from 'antd';
import Confetti from 'react-confetti';
const { Title } = Typography;
export default function ({ visible, handleButtonClick, handleCancel }) {
    //console.log('from congratz',visible)
    const { t } = useTranslation();
    return (
        <>
            <Modal
                visible={visible}
                onOk={handleButtonClick}
                //onCancel={handleCancel}
                footer={null}
                width={'720px'}
                closable={false}
                style={{ textAlign: 'center' }}
            >
                <img
                    alt="modal-header"
                    className="onboarding-Image margin-bottom-20"
                    style={{ width: '400px' }}
                    src={successSvg}
                />
                <Title level={1}>{t('onBoardingProgress.testApplication.congtratulations')}</Title>
                <Title level={2} style={{ marginTop: 0 }}>{t('onBoardingProgress.testApplication.grabYourInternationalCustomers')}</Title>
                <Button key="submit" size="large" type="primary" onClick={handleButtonClick}>
                    {t('onBoardingProgress.testApplication.testInYourStore')}
                </Button>
                <Confetti
                    run={visible}
                    width={window.innerWidth + 'px'}
                    height={window.innerHeight + 'px'}
                    style={{ position: 'fixed' }}
                />
            </Modal>
        </>
    )
}