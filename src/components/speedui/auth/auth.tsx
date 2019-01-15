import React from 'react'
import Button from '../button'
import Card from '../card'
import Form, { IFormInput } from '../form'
import Toast from '../toast'
import styles from './auth.module.css'

export interface IAuthProps {
    className?: string
    path?: string
}

export default abstract class Auth {
    static authChild(inputs: IFormInput[], name: string, className: string, onsubmit: (e: React.SyntheticEvent<Element>) => void, accept: (e: React.SyntheticEvent<Element>) => void, onchange: (e: React.SyntheticEvent<Element>) => void, isInvalid: boolean, toast: any) {
        const toastAttributes = toast && { type: toast.toastType, autoHideDuration: toast.toastAutoHideDuration, open: toast.isToastOpen, closeButton: toast.isToasCloseButton }
        return (
            <Card className={styles.auth + ' ' + className} name={name} >
                <Form inputs={inputs} onSubmit={onsubmit} onChange={onchange} />
                <Button disabled={isInvalid} label={name} handleClick={accept} />
                <Toast {...toastAttributes}>{toast && toast.toastMessage}</Toast>
            </Card>
        )
    }
}
