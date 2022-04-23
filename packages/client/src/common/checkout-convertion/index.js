import React from 'react';
import { Modal, Row, Alert, Tag, Button, Steps } from 'antd';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons'
import { isSubArray, storageEngine } from '../helper/commonMethods';

import './checkout-conversion.scss';


const { Step } = Steps;

export default function ({ user, form, handleCTA }) {
    /**
     * get missing currencies by user currenciew with user
     * selected currencies
     */
    const getMissingCurrencies = () => {

        const { getFieldValue } = form;

        const userCurrencies = (user || {}).enabled_presentment_currencies || [];
        const missingCurrencies = [];

        const selectedCurrencies = getFieldValue(['CurrencySelector', 'selectedCurrencies']);

        selectedCurrencies.forEach((currency) => {
            if (!userCurrencies.find((each) => each === Object.keys(currency)[0])) {
                missingCurrencies.push(Object.keys(currency)[0]);
            }
        })
        return missingCurrencies.map((currency) =>
            <Tag>{currency} {' '}</Tag>
        )
    }

    const contents = {
        allGood: (
            <Steps current={3} direction="vertical" >
                <Step title="Shopify Payments is enabled" />
                <Step title="Checkout currencies listed" />
                <Step title="Congrats! You're good to go!" />
            </Steps>
        ),
        someCurrenciesMissing: (

            <Steps current={1} direction="vertical" >
                <Step title="Shopify Payments is enabled" />
                <Step status="error" title="Some checkout currencies listed in the app are missing in Shopify Payments" description={
                    <div>
                        <p>
                            <a href="https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency/setup" target='_blank'>How to add more currencies in Shopify Payments?</a>
                        </p>
                        Missing Currencies:
                        {getMissingCurrencies()}
                    </div>
                }
                />
                <Step title="You're good to go!" />
            </Steps>
        ),
        notAvailable: (
            <Steps current={0} direction="vertical" >
                <Step status="error" title={
                    <>
                        Shopify Payments is not available (Checkout currency conversion only available in Shopify Payments)
                        <a href="https://help.shopify.com/en/manual/payments/shopify-payments/multi-currency/setup" target='_blank'>How to setup Shopify Payments Multi-Currency?</a>
                        <br />

                    </>
                } description={
                    <b style={{ color: '#4CAF50' }}>You can still use our app to convert prices on other pages!</b>
                } />
                <Step title="Checkout currencies listed in Shopify Payments" />
                <Step title="You're good to go!" />
            </Steps>
        )
    }
    /**
     * displaying contents based on user currencies and selected currencies
     */
    const getContents = () => {
        if (user.eligible_for_payments) {
            const userCurrencies = user.enabled_presentment_currencies;

            const { getFieldValue } = form;

            const selectedCurrencies = getFieldValue(['CurrencySelector', 'selectedCurrencies']);

            const selectedCurrenciesKeysArray = (selectedCurrencies || []).map((currency) => Object.keys(currency)[0])

            if (isSubArray(userCurrencies, selectedCurrenciesKeysArray)) {
                return contents.allGood;
            }
            return contents.someCurrenciesMissing;
        }

        return contents.notAvailable
        // return contents.allGood

    }

    return (
        <div className='modal-contents'>
            {getContents()}
            <Button type="primary" size="large" onClick={handleCTA} >I Understand</Button>
        </div>
    )
}