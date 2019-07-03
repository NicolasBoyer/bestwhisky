import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import List from '../../speedui/list'
import Search, { EFacetsType, ESearchKeyOrder } from '../../speedui/search'
import Sort from '../../speedui/sort'
import { ETableVar } from '../../speedui/survey'
import Whisky from '../whisky'
import styles from './home.module.css'
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
    {
        label: 'Votre note',
        name: 'note',
        required: true,
        tables: 'views/' + ETableVar.key + '/' + ETableVar.user,
        type: EFieldType.note
    }
]

const searchFields = ['name', 'description', 'createdBy', 'origin']

const sortEntries = [
    {
        name: 'Ordre alphabétique : ordre croissant',
        value: 'name-asc'
    },
    {
        name: 'Ordre alphabétique : ordre décroissant',
        value: 'name-desc'
    },
    {
        name: 'Note',
        value: 'note-desc'
    },
    {
        name: 'Du moins cher au plus cher',
        value: 'price-asc'
    },
    {
        name: 'Du plus cher au moins cher',
        value: 'price-desc'
    }
]

const facets = [
    {
        name: 'Prix',
        type: EFacetsType.checkbox,
        unit: '€',
        value: 'price'
    },
    {
        name: 'Contenance',
        type: EFacetsType.checkbox,
        unit: 'cl',
        value: 'size'
    },
    {
        name: 'Pays',
        type: EFacetsType.checkbox,
        value: 'origin'
    }
]

export interface IHomeProps {
    path: string
}

class Home extends React.Component<IHomeProps, any> {
    protected _isMounted = false
    protected sortKey = 'name'
    protected sortKeyOrder = ESearchKeyOrder.asc

    constructor(props: IHomeProps) {
        super(props)
        this.setGlobal({ isSubHeader: true })
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
                if (this._isMounted) {
                    this.setState({ datas: states })
                }
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
                    const userView = states[eltIndex].views.find((view: any) => this.global.user && this.global.user.displayName === view.author)
                    states[eltIndex].note = userView && userView.stars
                }
                if (this._isMounted) {
                    this.setState({ datas: states })
                }
            })
        }
    }

    public componentDidMount = () => this._isMounted = true

    public render() {
        return (
            <Fragment>
                <Box type={EBoxType.horizontal} position={EBoxPosition.end}>
                    <div className={styles.searchWrapper}>
                        <Search datas={this.state.datas} facets={facets} fields={searchFields} sortKey={this.sortKey} sortKeyOrder={this.sortKeyOrder} onChange={this.search} />
                    </div>
                </Box>
                <Box type={EBoxType.horizontal} position={EBoxPosition.end}>
                    <Sort entries={sortEntries} defaultValue={this.sortKey + '-' + this.sortKeyOrder} datas={this.state.datas} onChange={this.sort} />
                </Box>
                {this.global.user && <FormDialog inputs={addWhiskyInputs} title='Ajouter un Whisky' mode={EFormDialogMode.add} />}
                <List children={this.state.datas} component={Whisky} />
            </Fragment>
        )
    }

    public componentWillUnmount = () => {
        this._isMounted = false
        this.setGlobal({ isSubHeader: false })
    }

    protected search = (datas: any) => {
        console.log(datas)
        // TODO filter
        // TODO presentation avec attente de chargement comme youtube
        // TODO facettes prix / origin / size ?
        // TODO manque pertinence ?
        // TODO field box image ?
        // TODO sauvegarder recherche sortKey ?
        this.setState({ datas })
    }

    protected sort = (datas: any, sortKey: string, sortKeyOrder: string) => {
        this.sortKey = sortKey
        this.sortKeyOrder = sortKeyOrder as ESearchKeyOrder
        this.setState({ datas })
    }
}

export default Home
