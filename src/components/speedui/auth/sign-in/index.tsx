import { navigate } from '@reach/router'
import React, { Fragment } from 'react'
import { website } from '../../../../tools/config'
import { withFirebase } from '../../../../tools/firebase'
import { ERoutes } from '../../../../tools/routes'
import Utils from '../../../../tools/utils'
import Button from '../../button'
import { EFieldType } from '../../field'
import { IFormInput } from '../../form'
import { EToastType } from '../../toast'
import Auth, { IAuthProps } from '../auth'
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

class SignIn extends React.Component<IAuthProps, any> {
    initalStates: any = {
        toast: null
    }
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
                {Auth.authChild(inputs, 'Se connecter', styles.signIn, this.onSubmit, (e: React.SyntheticEvent) => this.onSubmit(e), this.onChange, isInvalid, this.state.toast)}
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
        this.setState({ [field.id]: field.value, ['valid_' + field.id]: Utils.isValidField(field), toast: null })
    }

    protected onSubmit = async (e: React.SyntheticEvent) => {
        if (this.props.firebase) {
            const { email, password } = this.state
            try {
                const authUser = await this.props.firebase.signInWithEmailAndPassword(email, password)
                if (authUser.user && !authUser.user.emailVerified) {
                    const error = { message: 'Votre compte n\'a pas été vérifié. Un mail de confirmation vous a été envoyé.' }
                    authUser.user.sendEmailVerification({ url: website.homepage })
                    throw error
                }
                this.setState({ ...this.initalStates, toast: { isToastOpen: true, toastMessage: 'Vous êtes connecté', toastType: EToastType.success, toastAutoHideDuration: 4 } })
                setTimeout(() => navigate('/'), 4000)
            } catch (error) {
                this.setState({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToasCloseButton: true } })
                console.error(error)
            }
        }
        e.persist()
    }
}

export default withFirebase(SignIn)
