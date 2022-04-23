import React, { Component } from 'react';
import background from '../../images/auth.svg';
import { Layout, Row, Col, Typography, Input, Button } from 'antd';
import * as Sentry from '@sentry/browser';

const { Content } = Layout;
const { Title } = Typography;

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, eventId: null };

    }

    componentDidMount() {

    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, shopName: '' });
        const { myshopify_domain } = JSON.parse(localStorage.getItem('user')) || {};
        console.log(`shop`, myshopify_domain);
        Sentry.setTag('shop', myshopify_domain);
        Sentry.withScope((scope) => {
            scope.setExtras(info);
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });
        console.log(`err from errorBoundary`, error);
        console.log(`err from errorBoundary`, info);
    }

    handleClick = () => {
        let cleanUrl = this.state.shopName.replace('http://', '');
        cleanUrl = this.state.shopName.replace('https://', '');
        cleanUrl = `${cleanUrl}${cleanUrl.indexOf('.myshopify.com') === -1 ? '.myshopify.com' : ''}`
        window.location.href = `${window.location.origin}/api/auth?shop=${cleanUrl}`
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <Button
                        style={{ margin: '2em auto', display: 'block' }}
                        size="large"
                        type="primary"
                        onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}
                    >
                        Report this Issue
                    </Button>
                    <div className="ufe-loading-page">
                        <Layout className="ufe-layout" style={{ background: `url('${background}') no-repeat -320px top`, backgroundSize: '88%' }}>
                            <Content>
                                <Row className="ublock">
                                    {
                                        <Col>
                                            <Title level={2}>Confused! Something went wrong</Title>
                                            <p style={{ margin: '0' }} id="subhead">Authorize app with Shopify to continue using UFE.</p>
                                            <div style={{ marginBottom: '2em' }}>
                                                <Input size="large" placeholder="shop.myshopify.com" />
                                            </div>
                                            <Button onClick={() => this.handleClick} className="ubtn-shadow" size="large" type="primary">Sign Up</Button>
                                        </Col>

                                    }
                                </Row>
                            </Content>
                        </Layout>
                    </div>
                </>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
