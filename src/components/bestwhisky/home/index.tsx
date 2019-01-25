import { Fragment } from 'react'
import React from 'reactn'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import List from '../../speedui/list'
import { ETableVar } from '../../speedui/survey'
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
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.text
    },
    {
        label: 'Origine',
        name: 'origin',
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.text
    },
    {
        label: 'Prix (€)',
        name: 'price',
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.number
    },
    {
        label: 'Contenance (cl)',
        name: 'size',
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.number
    },
    {
        label: 'Description',
        name: 'description',
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.area
    },
    {
        label: 'Choisir une image',
        name: 'image',
        tables: 'whiskies/' + ETableVar.key,
        type: EFieldType.image
    },
    // TODO : revoir la taille des champs pour homogénéiser
    {
        label: 'Note',
        name: 'note',
        required: true,
        tables: 'views/' + ETableVar.key + '/' + ETableVar.user,
        type: EFieldType.note
    }
]

export interface IHomeProps {
    path: string
}

class Home extends React.Component<IHomeProps, any> {
    datas: any

    constructor(props: IHomeProps) {
        super(props)
        this.state = { datas: [] }
        this.datas = this.state.datas

        if (this.global.firebase) {
            this.global.firebase.read('whiskies', (datas: firebase.database.DataSnapshot, returnType: string) => {
                const data = datas.val()
                data.views = []
                this.global.firebase.getEntry('views', data.key, (snapshot: firebase.database.DataSnapshot) => {
                    const view: any = {}
                    for (const key in snapshot.val()) {
                        if (snapshot.val().hasOwnProperty(key)) {
                            view.author = key
                            view.stars = snapshot.val()[key].note
                        }
                    }
                    data.views.push(view)
                    if (returnType === 'added') {
                        this.datas.push(data)
                    }
                    this.setState({ datas: this.datas })
                })
            })
        }
    }

    public render() {
        return (
            <Fragment>
                {this.global.firebase && <FormDialog inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EFormDialogMode.add} />}
                <List children={this.state.datas} component={Whisky} />
            </Fragment>
        )
    }
}

export default Home
