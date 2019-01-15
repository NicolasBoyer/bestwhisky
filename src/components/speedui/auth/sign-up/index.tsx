import { navigate } from '@reach/router'
import React from 'reactn'
import { website } from '../../../../tools/config'
import Utils from '../../../../tools/utils'
import { EFieldType } from '../../field'
import { IFormInput } from '../../form'
import { EToastType } from '../../toast'
import Auth, { IAuthProps } from '../auth'
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
        label: 'Password (au moins 8  caractères)',
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

class SignUp extends React.Component<IAuthProps, any> {
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
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true).length !== this.requiredFieldsNumber || this.state.passwordOne !== this.state.passwordTwo && this.state.passwordOne !== ''
        return Auth.authChild(inputs, 'S\'inscrire', styles.signUp, this.onSubmit, (e: React.SyntheticEvent) => this.onSubmit(e), this.onChange, isInvalid, this.state.toast)
    }

    // TODO à remettre sur la home
    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.target as HTMLInputElement
        this.setState({ [field.id]: field.value, ['valid_' + field.id]: Utils.isValidField(field), toast: null })
    }

    // TODO : bloquer si c le même displayName voir comment faire ! -> A PRIORI via une database ...
    // TODO : Voire si possible de mettre en rouge si c le pas le même password
    protected onSubmit = async (e: React.SyntheticEvent) => {
        if (this.global.firebase) {
            const { username, email, passwordOne } = this.state
            try {
                const authUser = await this.global.firebase.createUserWithEmailAndPassword(email, passwordOne)
                if (authUser.user) {
                    authUser.user.updateProfile({
                        displayName: username,
                        photoURL: null
                    })
                    authUser.user.sendEmailVerification({ url: website.homepage })
                }
                this.setState({ ...this.initalStates, toast: { isToastOpen: true, toastMessage: 'Un mail de confirmation vous a été envoyé.', toastType: EToastType.success, toastAutoHideDuration: 4 } })
                setTimeout(() => navigate('/'), 4000)
            } catch (error) {
                this.setState({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToasCloseButton: true } })
                console.error(error)
            }
        }
        e.persist()
    }
}

export default SignUp
