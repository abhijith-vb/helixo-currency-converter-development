/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    getUser,
    getToken,
    authenticateUser
} from './common/authentication/authentication';
import queryString from 'query-string';
// import Authentication from './components/authentication/Authentication';
import { withRouter } from 'react-router-dom';
import http from './common/http/httpProvider';
import { Layout } from 'antd';
import Authentication from './components/authentication';

import 'antd/dist/antd.less';
import './App.scss';
import './style/app.scss';
import './style/polarisStyleOverrides/index.scss';

import { initGoogleTagManager } from './extras/commonWidgets';
import { storageEngine,cleanup } from './common/helper/commonMethods';
import { initLiveChat, triggerMessage } from './extras/crispChat'
import { SKIP_VERIFY } from './common/constants/constants'


const { Content, Footer } = Layout;

function App(props) {
    const [authenticated, setAuthenticated] = useState(false);
    const [authenticating, setAuthenticating] = useState(true);

    useEffect(() => {
        const params = queryString.parse(props.location.search);
        const authenticate = (params = {}) => {
            // fetch token from url or from local storage.
            params.token = params.token ? params.token : getToken();

            // Set isNewUser to sessionStorage
            storageEngine.set('isNewUser', params.isNewUser);

            http.setAuthorizationToken(params.token);
            if (!params.token) {
                // if user is not authenticated and token is not present, set authenticating value as false.
                setAuthenticating(false);
            } else {
                // token is absent in localStorage and present in url, place an api call to authenticate user with specified token.
                getUserDetails(params.token, params.isNewUser);
            }
        };
        authenticate(params);
        // code here to handle componentWillUnMount
        console.log('App component is rendering');
        window.addEventListener('resize', handleResize);
        window.addEventListener('beforeunload', cleanup);
        
        return () =>cleanup();
    }, [props.location.search.token, props.location.search.isNewUser]);

    const handleResize = () => {
        // const isMobile = isMobileDevice();
        // // window.buckscc.isMobileDevice = isMobile;
        // const bucksccViewport = document.getElementById('buckscc-viewport');
        // if (isMobile) {
        //   bucksccViewport.setAttribute('content', 'width=720')
        // } else {
        //   bucksccViewport.setAttribute('content', 'width=device-width, initial-scale=1')
        // }
        // console.log(`resize`, isMobile);
    };
    const isMobileDevice = () => {
        // const mobileUserAgent = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
        // const mobileScreenSize = window.screen.width < 720;
        // return (mobileUserAgent && mobileScreenSize)
    };

    const getUserDetails = (token, isNewUser) => {
        getUser(token, data => {
            setAuthenticated(data ? true : false);
            setAuthenticating(false);
            // if (process.env.NODE_ENV !== 'development') {
            // initChatWidget(data);
            initGoogleTagManager(data);
            setTimeout(() => {
                const user = storageEngine.get('user');
                const skipVerify = storageEngine.get(SKIP_VERIFY);
                const { $crisp = {} } = window;
                if (typeof $crisp.push !== 'function' && (user.plan_name && !user.plan_name.match(/^(trial|affiliate|partner_test)$/) || skipVerify))
                    initLiveChat(user, () => {
                        triggerMessage('', user);
                        // triggerMessage(HELP_MESSAGE, data);
                    });
            }, 5000);
            // }
            // initChatWidget(data);
            // initGoogleTagManager(data);
        });
    };

    return (
        <>
            {
                <Authentication authenticated={authenticated} authenticating={authenticating} />
            }
        </>
    );
}

export default withRouter(App);
