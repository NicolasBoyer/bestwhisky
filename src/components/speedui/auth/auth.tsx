import React from 'react'
import Button from '../button'
import Card from '../card'
import Form, { IFormInput } from '../form'
import styles from './auth.module.css'

export interface IAuthProps {
    className?: string
    path?: string
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
