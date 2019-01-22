import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EMode } from '../../speedui/form-dialog'
import Toast, { EToastType } from '../../speedui/toast'
import Whisky, { IWhiskyProps } from '../whisky'
// import { addWhiskyInputs } from '../tools/config'

// TODO : A lier avec Firebase
const whiskiesJSON: IWhiskyProps[] = [
    // users, whiskies, views, comments

    {
        createdBy: 'Nico',
        // comments: [],
        description: 'A tester pour le type !',
        image: 'sample',
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
        label: 'Origine',
        name: 'origin',
        type: EFieldType.text
    },
    {
        label: 'Prix (€)',
        name: 'price',
        type: EFieldType.number
    },
    {
        label: 'Contenance (cl)',
        name: 'size',
        type: EFieldType.number
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
    // TODO : Note à revoir en mettant une nouvelle entrée views par key avec les meme key donc peut etre besoin d'un add différent ou on donne la key. peut etre ajouter une entrée table indiquant la table de la bdd
    // TODO : revoir la taille des champs pour homogénéiser
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
        const toastAttributes = this.state.toast && { type: this.state.toast.toastType, autoHideDuration: this.state.toast.toastAutoHideDuration, open: this.state.toast.isToastOpen, closeButton: this.state.toast.isToasCloseButton }
        return (
            <Fragment>
                {this.global.user && <FormDialog isInvalid={isInvalid} inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EMode.add} onSubmit={this.onSubmit} onChange={this.onChange} />}
                {/* <Sort /> */}
                {whiskiesJSON.map((datas: IWhiskyProps) => <Whisky {...datas} />)}
                <Toast {...toastAttributes}>{this.state.toast && this.state.toast.toastMessage}</Toast>
            </Fragment>
        )
    }

    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.currentTarget.tagName !== 'INPUT' && e.currentTarget.tagName !== 'TEXTAREA' ? (e.currentTarget.parentElement as HTMLElement).querySelector('input') : e.currentTarget as HTMLInputElement
        Utils.formChange(field as HTMLInputElement).then((states: any) => this.setState({ ...states, toast: null }))
    }

    protected onSubmit = async (e: React.SyntheticEvent) => {
        // TODO : voir si e mets pas ça en utils -> A voir ou alors rendre ce home dans speedui
        const datas: any = {}
        for (const key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                const value = this.state[key]
                if (value !== '' && key.indexOf('valid_') === -1 && key.indexOf('toast') === -1) {
                    // TODO : Il faudrait un data[table][key] et en dessous on boucle sur la première entrée
                    datas[key] = value
                }
            }
        }
        // TODO : créer une fonction read
        console.log(datas)
        if (this.global.firebase) {
            this.global.firebase.add('whiskies', datas).then(() => {
                this.setState({ ...this.initalStates, toast: { isToastOpen: true, toastMessage: 'L\'enregistrement a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
            }).catch((error: any) => {
                this.setState({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToasCloseButton: true } })
                console.error(error)
            })
        }
        e.persist()
    }
}

export default Home
