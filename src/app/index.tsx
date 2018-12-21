import React, { Fragment } from 'react'
import Footer from '../components/speedui/footer'
import Header from '../components/speedui/header'
import SubHeader from '../components/speedui/sub-header'
import Routes from '../tools/routes'
import styles from './app.module.css'

export default class App extends React.Component {
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
