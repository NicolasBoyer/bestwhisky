import { Location, Router } from '@reach/router'
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './animate.css'
import styles from './pages.module.css'

class Pages extends React.Component<any> {
    history: string[] = []

    constructor(props: any) {
        super(props)
        // TODO si on utilise un page sur le page on aura location a voir
        window.onpopstate = (event) => {
            this.history.pop()
        }
    }

    public render() {
        console.log(this.history)
        // console.log(window.history.state)
        console.log(this.history.includes(location.pathname))
        const { children } = this.props
        return (
            <Location>
                {({ location }) => (
                    <TransitionGroup>
                        <CSSTransition key={location.key} classNames={this.history.includes(location.pathname) ? 'home' : 'page'} timeout={700}>
                            <Router location={location} className={styles.router}>
                                {children}
                            </Router>
                        </CSSTransition>
                    </TransitionGroup>
                )}
            </Location>
        )
    }

    public shouldComponentUpdate = () => {
        if (!this.history.includes(location.pathname)) {
            this.history.push(location.pathname)
        }
        return true
    }

    // public componentDidUpdate = () => this.history.push(location.pathname)
}

export default Pages
