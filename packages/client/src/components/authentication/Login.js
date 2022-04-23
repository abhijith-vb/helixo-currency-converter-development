import React, { useState, useEffect } from 'react';
import { Row, Col, Layout, Input, Typography, Button, Form } from 'antd';
// import './../../components/modules/upsell-funnel-engine/upsellFunnelEngineMain.scss';
import background from '../../images/auth1.svg';
import logo from '../../images/bucks-logo.png';
import './Login.scss';
import { storageEngine } from '../../common/helper/commonMethods';
// import '../../commonStyles.scss';

const { Content } = Layout;
const { Title } = Typography;

const Login = (props, state) => {
    const [shopName, setShopName] = useState('');
    const [buttonText, setButtonText] = useState('Install Now');
    const [btnClicked, setBtnClicked] = useState(false);

    useEffect(() => {
        const user = storageEngine.get('user') || {};
        if (user.myshopify_domain) {
            setShopName(user.myshopify_domain);
            setButtonText('Sign In');
        }
    }, [])

    const handleChange = (e) => {
        /* If user type . then add myshopify domain to the text */
        let val = e.target.value;
        setShopName(val);
    }
    const handleClick = (e) => {
        e.preventDefault();
        setBtnClicked(true);
        let cleanUrl = shopName.replace('http://', '');
        cleanUrl = shopName.replace('https://', '');
        cleanUrl = `${cleanUrl}${cleanUrl.indexOf('.myshopify.com') === -1 ? '.myshopify.com' : ''}`
        window.location.href = `${window.location.origin}/api/auth?shop=${cleanUrl}`
    }
    const isAuthenticated = !props.authenticated && !props.authenticating;
    return (
        <div className={`ufe-loading-page ${props.authenticating ? 'is-loading' : ''}`}>
            <Layout className="ufe-layout">
                {(isAuthenticated) && (<div className="brand-image" style={{ backgroundImage: `url('${background}')` }}></div>)}
                <Content className={isAuthenticated ? 'ufe-login' : ''}>
                    <Row className="ublock">
                        {
                            (props.authenticating) && (
                                <>
                                    <Col>
                                        <Title level={2}>Authorizing...</Title>
                                    </Col>
                                    <Col>
                                        <div className="uloader pre-uloader"></div>
                                    </Col>
                                </>
                            )
                        }
                        {
                            (!props.authenticated && !props.authenticating) && (
                                <>
                                    <Col>
                                        <div className="logo">
                                            <img alt="BUCKS: Currency Converter Logo" src={logo} />
                                        </div>
                                        <Form>
                                            <Title level={2}>Authorization Required</Title>
                                            <p style={{ margin: '0' }} id="subhead">Login with your store to continue using BUCKS.</p>
                                            <div style={{ marginBottom: '1em' }}>
                                                <Input size="large" required onChange={handleChange} value={shopName} placeholder="shop.myshopify.com" />
                                            </div>
                                            {/* <div className={btnClicked ? 'uloader' : ''}> */}
                                            <Button onClick={handleClick} loading={btnClicked} block className="ubtn-shadow onboard-btn" size="large" type="primary">{buttonText}</Button>
                                            <p style={{ fontSize: '80%', marginTop: '10px' }} id="subhead">🎉 100% FREE. 🔐 100% Secured.</p>
                                            {/* </div> */}
                                        </Form>
                                    </Col>
                                </>
                            )
                        }
                    </Row>
                </Content>
            </Layout>
        </div>
    );
};

export default Login;
