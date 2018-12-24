import { Router } from '@reach/router'
import React from 'react'
import Home from '../components/bestwhisky/home'
import SignIn from '../components/speedui/auth/sign-in'
import SignUp from '../components/speedui/auth/sign-up'
import NotFound from '../components/speedui/not-found'
import { FirebaseContext } from './firebase'

export enum ERoutes { signin = '/signin', signup = '/signup' }

// tslint:disable-next-line:variable-name
const Routes = () => {
    return (
        <Router>
            <NotFound default />
            <Home path='/' />
            {/* Ne marche pas car Pas poossible de mettre un component ici */}
            <FirebaseContext.Consumer>
                {(firebase) => <SignUp path={ERoutes.signup} firebase={firebase} />}
            </FirebaseContext.Consumer>
            {/* <SignUp path={ERoutes.signin} /> */}
        </Router>
    )
}

export default Routes
