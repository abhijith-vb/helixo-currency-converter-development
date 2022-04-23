import React, { useState } from 'react';
import { Row, Typography, Progress, Col, Rate, Button } from 'antd';
import { debounce } from '../helper/commonMethods';
import http from '../http/httpProvider';
import './styles.scss';

const { Title, Text } = Typography;

export default function ({ setVisibility, setShowRecommendedApps }) {

    const [takeFeedback, setTakeFeedback] = useState(false);

    const openChatWidget = debounce(() => {
        window.fcWidget && window.fcWidget.track('app_review_not_5_star', {
            value: true
        });
    }, 2000)

    const onRaterChange = (value) => {
        http.postAction('api/v1/user/onboarding', {
            feedbackRating: value,
            feedbackGiven: true,
            step: 4,
        })
            .then(res => {
                if (value === 5) {
                    window.open('https://apps.shopify.com/bucks-currency-converter#modal-show=ReviewListingModal')
                }
                else {
                    openChatWidget();
                }
                setShowRecommendedApps(true);
                setVisibility(false);
            })
            .catch(err => {
                console.log('failed')
            })
    }

    return (
        <div className="onboarding-4-review">
            <Row justify="center" > <Title level={2}>You're the best! Appreciate our small app!</Title></Row >
            <div className="step-wrapper">
                {/* <Progress className="onboarding-4-progress" percent={85} strokeWidth="20px" status="active" /> */}
                <div className="onboarding-4-completed">
                    {/* <Row><Text className="onboarding-4-completed-text" delete>1. Configure money format</Text></Row>
                    <Row><Text className="onboarding-4-completed-text" delete>2. Save settings</Text></Row>
                    <Row><Text className="onboarding-4-completed-text" delete>3. Enable App</Text></Row>
                    <Row><Text className="onboarding-4-completed-text" delete>4. Test on store</Text></Row> */}
                    <Row className="rate-feedback">
                        <Col span={11}>
                            <Text className="onboarding-4-subheading">Rate your feedback</Text>
                        </Col>
                        <Col span={13} className='rater'>
                            <Rate onChange={onRaterChange} />
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="onboarding-4-why">
                <Row><Title level={3}>Enjoying the app?</Title></Row>
                <Row>
                    <Text className="onboarding-4-text"><Text underline strong>FREE Forever</Text> + Instant loader + Auto geolocation and <Text underline strong>30+ features</Text></Text>
                </Row>
                <Row>
                    <Text className="onboarding-4-text">Appreciate our <Text underline strong>countless hours of effort</Text> in building App 🧑‍💻</Text>
                </Row>
                <Row>
                    <Text className="onboarding-4-text">Your Feedback, <Text underline strong>Our Happiness 🤗</Text></Text>
                </Row>
                <Row>
                    <Text className="onboarding-4-text">Spread love ❤️</Text>
                </Row>
                <Row align="middle" justify="center" style={{ flexDirection: 'column' }}>
                    {takeFeedback ? <><Title level={2} style={{ color: '#000' }}>Awesome!! Click the star please!</Title><Rate onChange={onRaterChange} /></> : <Button style={{ marginTop: '1em' }} type="primary" size="large" onClick={() => setTakeFeedback(true)}>👍 You Rock ! Take my review</Button>}
                </Row>
            </div>
        </div>
    )

}