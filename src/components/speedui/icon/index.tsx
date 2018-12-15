import React from 'react'
import icons from '../../../assets/img/icons.svg'
import styles from './icon.module.css'

// tslint:disable-next-line:variable-name
const Icon = (props: { name: string, className: string, children?: any }) => {
    return (
        <svg className={styles.icon + ' ' + props.className} aria-hidden='true'>
            <use href={icons + '#icon-' + props.name} />
            {props.children}
        </svg>
    )
}

export default Icon
