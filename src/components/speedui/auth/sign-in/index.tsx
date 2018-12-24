import React, { Fragment } from 'react'
import { ERoutes } from '../../../../tools/routes'
import Utils from '../../../../tools/utils'
import Button from '../../button'
import { EFieldType } from '../../field'
import { IFormInput } from '../../form'
import Auth, { IAuthProps } from '../auth-config'
import styles from '../auth.module.css'

const inputs: IFormInput[] = [
    {
        label: 'Adresse email',
        name: 'email',
        required: true,
        type: EFieldType.email
    },
    {
        label: 'Password',
        name: 'password',
        required: true,
        type: EFieldType.password
    }
]

export default class SignIn extends React.Component<IAuthProps, any> {
    initalStates: any = {}
    requiredFieldsNumber: number = 0

    constructor(props: IAuthProps) {
        super(props)
        inputs.forEach((input) => {
            this.initalStates[input.name] = ''
            this.initalStates['valid_' + input.name] = !input.required
            if (input.required) {
                this.requiredFieldsNumber++
            }
        })
        this.state = { ...this.initalStates }
    }

    public render() {
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true).length !== this.requiredFieldsNumber
        return (
            <Fragment>
                {Auth.authChild(inputs, 'Se connecter', styles.signIn, this.onSubmit, (e: React.SyntheticEvent) => this.onSubmit(e), this.onChange, isInvalid)}
                <div className={styles.extraSignin}>
                    <span>Vous n'avez pas de compte ? </span>
                    <Button label='Inscrivez vous' handleClick={ERoutes.signup} />
                </div>
            </Fragment>
        )
    }

    // TODO à remettre sur la home + remonter la vilidité avec test email url ou autre
    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.target as HTMLInputElement
        this.setState({ [field.id]: field.value, ['valid_' + field.id]: Utils.isValidField(field) })
    }

    protected onSubmit = (e: React.SyntheticEvent) => {
        console.log(this.state)
    }

    // protected handleSubmit = (e: React.SyntheticEvent) => {
    //     alert('A name was submitted: ' + this.state.value)
    //     e.preventDefault()
    // }

    // protected handleChange = (e: React.SyntheticEvent) => {
    //     this.setState({ value: (e.target as HTMLInputElement).value })
    // }
}
