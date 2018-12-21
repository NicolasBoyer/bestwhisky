import React from 'react'
import { ERoutes } from '../../../tools/routes'
import Button, { EIconPosition } from '../button'
import styles from './header.module.css'

// TODO : Add sticky
export default class Header extends React.Component {
    public render() {
        return (
            <header className={styles.header}>
                <nav>
                    <Button className={styles.login} iconName='enter' iconPosition={EIconPosition.beforeLabel} label='login' handleClick={ERoutes.signin} />
                </nav>
            </header>
        )
    }
}
