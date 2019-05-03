import { Fragment } from 'react'
import React from 'reactn'
import Home from '../components/bestwhisky/home'
import WhiskyDetails from '../components/bestwhisky/whisky-details'
import SignIn from '../components/speedui/auth/sign-in'
import Footer from '../components/speedui/footer'
import Header from '../components/speedui/header'
import Pages from '../components/speedui/pages'
import SubHeader from '../components/speedui/sub-header'
import Toast from '../components/speedui/toast'
import Routes, { ERoutes } from '../tools/routes'
import styles from './app.module.css'

class App extends React.Component<{}> {

    constructor(props: {}) {
        super(props)
        if (this.global.firebase) {
            this.global.firebase.getCurrentUser((user: firebase.User | null) => user && user.emailVerified && this.setGlobal({ user }))
        }
        this.setGlobal({ isSubHeader: location.href === this.global.homeUrl })
    }

    public render() {
        const toastAttributes = this.global.toast && { type: this.global.toast.toastType, autoHideDuration: this.global.toast.toastAutoHideDuration, open: this.global.toast.isToastOpen, closeButton: this.global.toast.isToastCloseButton }
        return (
            <Fragment>
                {/* Ajouter name a afficher si néecessaire ... */}
                <Header />
                <main className={styles.main}>
                    {/* Disparait sur petits écrans */}
                    <SubHeader name='Best Whisky' isVisible={this.global.isSubHeader} />
                    <section className={styles.content + (!this.global.isSubHeader ? ' ' + styles.noSubHeader : '')}>
                        <Routes />
                        {/* <Pages> */}
                        {/* <NotFound default /> */}
                        {/* <Home path='/' /> */}
                        {/* <SignIn path={ERoutes.signin} /> */}
                        {/* <SignUp path={ERoutes.signup} /> */}
                        {/* <WhiskyDetails path={ERoutes.whisky + ':name'} /> */}
                        {/* </Pages> */}
                    </section>
                </main>
                <Footer createdBy='Nicolas Boyer' credit='Best Whisky' />
                <Toast {...toastAttributes}>{this.global.toast && this.global.toast.toastMessage}</Toast>
            </Fragment>
        )
    }
}

export default App
