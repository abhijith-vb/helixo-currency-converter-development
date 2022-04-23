import React from 'react';
import { Modal } from 'antd';
import { storageEngine } from '../../../../common/helper/commonMethods';
import http from '../../../../common/http/httpProvider';
import CheckoutConversionContent from '../../../../common/checkout-convertion';

export default function ({ showModal, setShowModal, user, form, setShowCheckoutConversionInfo }) {


    const handleCancel = () => {
        setShowModal(false);
        setShowCheckoutConversionInfo(false);
        storageEngine.set("user", {
            ...user,
            showedCheckoutConversion: true,
        })

        http.postAction('api/v1/user/checkoutConversion', { showedCheckoutConversion: true })
            .then((res) => {
                //
            })
            .catch((err) => {
                // err
            })
    }


    return (

        <Modal visible={showModal} footer={null} onCancel={handleCancel}>
            <CheckoutConversionContent user={user} form={form} handleCTA={handleCancel} />
        </Modal>
    )
}