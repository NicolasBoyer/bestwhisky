import React from 'reactn'
import { ERoutes } from '../../../tools/routes'
import Button, { EIconPosition } from '../button'
import styles from './header.module.css'

// TODO : Add sticky
class Header extends React.Component {
    public render() {
        return (
            <header className={styles.header}>
                <nav>
                    {!this.global.user && <Button className={styles.log} iconName='enter' iconPosition={EIconPosition.beforeLabel} label='login' handleClick={ERoutes.signin} />}
                    {this.global.user && <Button className={styles.log} iconName='exit' iconPosition={EIconPosition.beforeLabel} label={this.global.user.displayName + ' - logout'} handleClick={this.signOut} />}
                </nav>
            </header>
        )
    }

    protected signOut = () => {
        if (this.global.firebase) {
            this.global.firebase.signOut()
            this.setGlobal({ user: null })
        }
    }
}

export default Header
