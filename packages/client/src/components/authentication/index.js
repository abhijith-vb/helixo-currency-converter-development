import React from 'react';
import { withRouter } from 'react-router-dom';
import Login from './Login';
import MainLayout from './MainLayout';
import Loader from '../../common/loader';


function Authentication(props) {
    const IS_AUTHENTICATING = props.authenticating;
    const IS_AUTHENTICATED = (props.authenticated && !props.authenticating);
    //const IS_AUTHENTICATED = true
    return (
        <>
            {
                IS_AUTHENTICATING ? <Loader /> :
                    IS_AUTHENTICATED ? <MainLayout />
                        : <Login />
            }
        </>
    )
}

export default withRouter(Authentication);