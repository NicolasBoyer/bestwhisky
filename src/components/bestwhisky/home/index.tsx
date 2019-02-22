import { Fragment } from 'react'
import React from 'reactn'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import List from '../../speedui/list'
import { ETableVar } from '../../speedui/survey'
import Whisky from '../whisky'
// import { addWhiskyInputs } from '../tools/config'

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
    constructor(props: IHomeProps) {
        super(props)
        this.state = { datas: [] }
        const states = this.state.datas
        if (this.global.firebase) {
            this.global.firebase.read('whiskies', (datas: firebase.database.DataSnapshot, returnType: string) => {
                const data = datas.val()
                data.views = []
                const eltIndex = states.findIndex((obj: any) => obj.key === datas.key)
                if (returnType === 'added') {
                    states.push(data)
                }
                if (returnType === 'changed') {
                    for (const key in data) {
                        if (data.hasOwnProperty(key) && data[key] && typeof data[key] === 'string') {
                            states[eltIndex][key] = data[key]
                        }
                    }
                }
                if (returnType === 'removed') {
                    states.splice(eltIndex, 1)
                }
                this.setState({ datas: states })
            })
            this.global.firebase.read('views', (datas: firebase.database.DataSnapshot, returnType: string) => {
                const data = datas.val()
                const eltIndex = states.findIndex((obj: any) => obj.key === datas.key)
                if (returnType === 'added' || returnType === 'changed') {
                    states[eltIndex].views = []
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const view: any = {}
                            view.author = key
                            view.stars = data[key].note
                            states[eltIndex].views.push(view)
                        }
                    }
                }
                this.setState({ datas: states })
            })
        }
    }

    public render() {
        return (
            <Fragment>
                {this.global.user && <FormDialog inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EFormDialogMode.add} />}
                <List children={this.state.datas} component={Whisky} />
            </Fragment>
        )
    }
}

export default Home
