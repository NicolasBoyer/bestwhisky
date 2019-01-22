import { Fragment } from 'react'
import React from 'reactn'
import Footer from '../components/speedui/footer'
import Header from '../components/speedui/header'
import SubHeader from '../components/speedui/sub-header'
import Routes from '../tools/routes'
import styles from './app.module.css'

class App extends React.Component<{}> {

    constructor(props: {}) {
        super(props)
        if (this.global.firebase) {
            this.global.firebase.getCurrentUser((user: firebase.User | null) => user && user.emailVerified && this.setGlobal({ user }))
        }
    }

    public render() {
        return (
            <Fragment>
                {/* Ajouter name a afficher si néecessaire ... */}
                <Header />
                <main className={styles.main}>
                    {/* Disparait sur petits écrans */}
                    <SubHeader name='Best Whisky' />
                    <section className={styles.content}>
                        <Routes />
                    </section>
                </main>
                <Footer />
            </Fragment>
        )
    }
}

export default App
