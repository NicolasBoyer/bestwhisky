import React from 'react'
import Firebase from '../../../tools/firebase'
import Button from '../button'
import Card from '../card'
import Form, { IFormInput } from '../form'
import styles from './auth.module.css'

export interface IAuthProps {
    path?: string
    // TODO : connection firebase
    firebase: Firebase | null
}

export default abstract class Auth {
    static authChild(inputs: IFormInput[], name: string, className: string, onsubmit: (e: React.SyntheticEvent<Element>) => void, accept: (e: React.SyntheticEvent<Element>) => void, onchange: (e: React.SyntheticEvent<Element>) => void, isInvalid: boolean) {
        return (
            <Card className={styles.auth + ' ' + className} name={name} >
                <Form inputs={inputs} onSubmit={onsubmit} onChange={onchange} />
                <Button disabled={isInvalid} label={name} handleClick={accept} />
            </Card>
        )
    }
}
