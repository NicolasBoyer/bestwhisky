import { Router } from '@reach/router'
import React from 'react'
import Home from '../components/bestwhisky/home'
import SignIn from '../components/speedui/auth/sign-in'
import SignUp from '../components/speedui/auth/sign-up'
import NotFound from '../components/speedui/not-found'

export enum ERoutes { signin = '/signin', signup = '/signup' }

// tslint:disable-next-line:variable-name
const Routes = () => {
    return (
        <Router>
            <NotFound default />
            <Home path='/' />
            <SignIn path={ERoutes.signin} />
            <SignUp path={ERoutes.signup} />
        </Router>
    )
}

export default Routes
