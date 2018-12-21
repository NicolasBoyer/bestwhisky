import React from 'react'
import Button from '../button'
import Card from '../card'
import Form, { IFormInput } from '../form'
import { signInInputs } from './auth-config'
import styles from './auth-form.module.css'

export enum EAuthType { signin = 'signin', signup = 'signup' }

export interface IAuthFormProps {
    path?: string
    type: EAuthType
}

export default class AuthForm extends React.Component<IAuthFormProps> {
    public render() {
        let className: string = ''
        let name: string = ''
        let inputs: IFormInput[] = []
        switch (this.props.type) {
            case EAuthType.signin:
                className = 'signin'
                name = 'Se connecter'
                inputs = signInInputs
                break
            case EAuthType.signup:
                className = 'signup'
                name = 'S\'inscrire'
                break
        }
        return (
            <Card className={styles.auth + ' ' + className} name={name} >
                <Form inputs={inputs} onSubmit={() => console.log('blop')} onChange={() => console.log('blip')} />
                <Button label={name} handleClick={() => console.log('blirp')} />
            </Card>
        )
    }
}
