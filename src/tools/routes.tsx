import { Router } from '@reach/router'
import React from 'react'
import Home from '../components/bestwhisky/home'
import AuthForm, { EAuthType } from '../components/speedui/auth-form'
import NotFound from '../components/speedui/not-found'

export enum ERoutes { signin = 'signin', signup = 'signup' }

// tslint:disable-next-line:variable-name
const Routes = () => {
    return (
        <Router>
            <NotFound default />
            <Home path='/' />
            <AuthForm path={ERoutes.signin} type={EAuthType.signin} />
            <AuthForm path={ERoutes.signup} type={EAuthType.signup} />
        </Router>
    )
}

export default Routes
