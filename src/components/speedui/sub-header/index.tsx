import React from 'react'
import styles from './sub-header.module.css'

// TODO : Add sticky et size
// tslint:disable-next-line:variable-name
const SubHeader = (props: { name: string, isVisible?: boolean }) => {
    if (!props.isVisible) {
        return null
    }
    return (
        <div className={styles.subHeader}>
            <h1 className={styles.title}>
                <span>{props.name}</span>
            </h1>
        </div>
    )
}

export default SubHeader
