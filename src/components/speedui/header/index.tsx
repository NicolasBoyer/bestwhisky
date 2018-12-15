import React from 'react'
import styles from './header.module.css'

// TODO : Add sticky
export default class Header extends React.Component {
    public render() {
        return (
            <header className={styles.header} />
        )
    }
}
