import { Fragment } from 'react'
import React from 'reactn'
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
        type: EFieldType.note
    }
]

export interface IHomeProps {
    path: string
}

interface IHomeState {
    value: string
}

class Home extends React.Component<IHomeProps, IHomeState> {
    constructor(props: IHomeProps) {
        super(props)
        this.state = { value: '' }
    }

    public render() {
        return (
            <Fragment>
                {this.global.user && <FormDialog inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EMode.add} onSubmit={this.handleSubmit} onChange={this.handleChange} />}
                {/* <Sort /> */}
                {whiskiesJSON.map((datas: IWhiskyProps) => <Whisky {...datas} />)}
            </Fragment>
        )
    }

    protected handleSubmit = (e: React.SyntheticEvent) => {
        alert('A name was submitted: ' + this.state.value)
        e.preventDefault()
    }

    protected handleChange = (e: React.SyntheticEvent) => {
        this.setState({ value: (e.target as HTMLInputElement).value })
    }
}

export default Home
