import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EMode } from '../../speedui/form-dialog'
import Whisky, { IWhiskyProps } from '../whisky'
// import { addWhiskyInputs } from '../tools/config'

// TODO : A lier avec Firebase
const whiskiesJSON: IWhiskyProps[] = [
    {
        createdBy: 'Nico',
        // comments: [],
        description: 'A tester pour le type !',
        id: '1',
        image: 'sample',
        // Pas sur de garder la key
        key: '1',
        name: 'REDBREAST 15 ans Single Pot Still 46%',
        origin: 'Irlande / Cork County',
        price: 87,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 5,
                view: 'TextArea'
            },
            {
                author: 'Elendil',
                stars: 4
            },
            {
                author: 'Sylvain',
                stars: 4
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '2',
        image: 'bike',
        key: '2',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 3,
                view: 'TextArea'
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '3',
        image: 'elephants',
        key: '3',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 2,
                view: 'TextArea'
            }
        ]
    },
    {
        createdBy: 'Nico',
        description: 'A tester pour le type !',
        id: '4',
        image: 'sheep',
        key: '4',
        name: 'REDBREAST 12 ans Single Pot Still 40%',
        origin: 'Irlande / Cork County',
        price: 58,
        size: 70,
        views: [
            {
                author: 'Nico',
                stars: 4,
                view: 'TextArea'
            }
        ]
    }
]

// TODO : A passer dans config
export const addWhiskyInputs: IFormInput[] = [
    {
        label: 'Nom',
        name: 'name',
        required: true,
        type: EFieldType.text
    },
    {
        label: 'Description',
        name: 'description',
        type: EFieldType.area
    },
    {
        label: 'Choisir une image',
        name: 'image',
        type: EFieldType.image
    },
    {
        label: 'Note',
        name: 'note',
        required: true,
        type: EFieldType.note
    }
]

export interface IHomeProps {
    path: string
}

class Home extends React.Component<IHomeProps, any> {
    initalStates: any = {
        toast: null
    }
    requiredFieldsNumber: number = 0

    constructor(props: IHomeProps) {
        super(props)
        addWhiskyInputs.forEach((input) => {
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
                {this.global.user && <FormDialog isInvalid={isInvalid} inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EMode.add} onSubmit={this.onSubmit} onChange={this.onChange} />}
                {/* <Sort /> */}
                {whiskiesJSON.map((datas: IWhiskyProps) => <Whisky {...datas} />)}
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
        console.log(this.state)
        // if (this.global.firebase) {
        //     const { username, email, passwordOne } = this.state
        //     try {
        //         const authUser = await this.global.firebase.createUserWithEmailAndPassword(email, passwordOne)
        //         if (authUser.user) {
        //             authUser.user.updateProfile({
        //                 displayName: username,
        //                 photoURL: null
        //             })
        //             authUser.user.sendEmailVerification({ url: website.homepage })
        //         }
        //         this.setState({ ...this.initalStates, toast: { isToastOpen: true, toastMessage: 'Un mail de confirmation vous a été envoyé.', toastType: EToastType.success, toastAutoHideDuration: 4 } })
        //         setTimeout(() => navigate('/'), 4000)
        //     } catch (error) {
        //         this.setState({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToasCloseButton: true } })
        //         console.error(error)
        //     }
        // }
        e.persist()
    }
}

export default Home
