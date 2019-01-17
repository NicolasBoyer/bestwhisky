import { navigate } from '@reach/router'
import { Fragment } from 'react'
import React from 'reactn'
import { website } from '../../../../tools/config'
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
            if (input.required || input.type === EFieldType.email || input.type === EFieldType.url || input.type === EFieldType.password) {
                this.initalStates['valid_' + input.name] = !input.required
                this.requiredFieldsNumber++
            }
        })
        this.state = { ...this.initalStates }
    }

    public render() {
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true && key.includes('valid_')).length !== this.requiredFieldsNumber
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

    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.target as HTMLInputElement
        if (field.required || field.type === EFieldType.email || field.type === EFieldType.url || field.type === EFieldType.password) {
            this.setState({ ['valid_' + field.id]: Utils.isValidField(field) })
        } else if (Utils.isStrInParentsClass(e.currentTarget as HTMLElement, 'required')) {
            this.setState({ ['valid_' + (e.currentTarget.parentElement as HTMLElement).id]: true })
        }
        this.setState({ [field.id]: field.value, toast: null })
    }

    protected onSubmit = async (e: React.SyntheticEvent) => {
        if (this.global.firebase) {
            const { email, password } = this.state
            try {
                const authUser = await this.global.firebase.signInWithEmailAndPassword(email, password)
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

export default SignIn
