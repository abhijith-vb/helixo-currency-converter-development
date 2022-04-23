import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from './common/authentication/errorBoundary';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

if (process.env.NODE_ENV !== 'development')
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        release: process.env.SENTRY_RELEASE_KEY,
    });

i18n.init().then(() =>
    ReactDOM.render(
        <BrowserRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
        , document.getElementById('root'))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();