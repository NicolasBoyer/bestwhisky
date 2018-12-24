import React from 'react'
import Utils from '../../../../tools/utils'
import { EFieldType } from '../../field'
import { IFormInput } from '../../form'
import Auth, { IAuthProps } from '../auth-config'
import styles from '../auth.module.css'

export const inputs: IFormInput[] = [
    {
        label: 'Username',
        name: 'username',
        required: true,
        type: EFieldType.text
    },
    {
        label: 'Adresse email',
        name: 'email',
        required: true,
        type: EFieldType.email
    },
    {
        label: 'Password',
        name: 'passwordOne',
        required: true,
        type: EFieldType.password
    },
    {
        label: 'Password (confirmation)',
        name: 'passwordTwo',
        required: true,
        type: EFieldType.password
    }
]

export default class SignUp extends React.Component<IAuthProps, any> {
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
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true).length !== this.requiredFieldsNumber || this.state.passwordOne !== this.state.passwordTwo && this.state.passwordOne !== ''
        return Auth.authChild(inputs, 'S\'inscrire', styles.signUp, this.onSubmit, (e: React.SyntheticEvent) => this.onSubmit(e), this.onChange, isInvalid)
    }

    // TODO à remettre sur la home
    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.target as HTMLInputElement
        this.setState({ [field.id]: field.value, ['valid_' + field.id]: Utils.isValidField(field) })
    }

    protected onSubmit = async (e: React.SyntheticEvent) => {
        if (this.props.firebase) {
            const { username, email, passwordOne } = this.state
            try {
                const authUser = await this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
                this.setState({ ...this.initalStates })
                console.log('success')
            } catch (error) {
                console.log('error')
            }
            // .catch(error => {
            //     this.setState({ error });
            // });
        }
        e.preventDefault()
    }

    // protected handleSubmit = (e: React.SyntheticEvent) => {
    //     alert('A name was submitted: ' + this.state.value)
    //     e.preventDefault()
    // }

    // protected handleChange = (e: React.SyntheticEvent) => {
    //     this.setState({ value: (e.target as HTMLInputElement).value })
    // }
}
