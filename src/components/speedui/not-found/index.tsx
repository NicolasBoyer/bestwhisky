import React from 'react'
import styles from './not-found.module.css'

// TODO : styler la page
// tslint:disable-next-line:variable-name
const NotFound = (props: { default: boolean }) => {
    return (
        <div>
            <h2>
                <span>404</span>
            </h2>
            <div>ERREUR !</div>
            <div>Page non trouvé ...</div>
        </div>
    )
}

export default NotFound
