import React from 'react';
import AppSettings from './../../components/currency-converter';
import { BrowserRouter, Route } from 'react-router-dom';

const AppRouter = () => (
    <BrowserRouter>
        <Route path="/" component={AppSettings} exact={true} />
    </BrowserRouter>
);
export default AppRouter;
