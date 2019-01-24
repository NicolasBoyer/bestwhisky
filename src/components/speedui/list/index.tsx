import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import { EFieldType } from '../../speedui/field'
import { IFormInput } from '../../speedui/form'
import FormDialog, { EMode } from '../../speedui/form-dialog'
import Toast, { EToastType } from '../../speedui/toast'

export enum ETableVar { key = '$key', user = '$user' }

export interface IListProps {
    children: any[]
    component: any
    inputs?: IFormInput[]
}

class List extends React.Component<IListProps, any> {
    initalStates: any = {
        toast: null
    }
    requiredFieldsNumber: number = 0
    tables: { [str: string]: string } = {}

    constructor(props: IListProps) {
        super(props)
        if (this.props.inputs) {
            this.props.inputs.forEach((input) => {
                if (input.tables) {
                    this.tables[input.name] = input.tables
                }
                this.initalStates[input.name] = ''
                if (input.required || input.type === EFieldType.email || input.type === EFieldType.url || input.type === EFieldType.password) {
                    this.initalStates['valid_' + input.name] = !input.required
                    this.requiredFieldsNumber++
                }
            })
        }
        this.state = { ...this.initalStates }
    }

    public render() {
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true && key.includes('valid_')).length !== this.requiredFieldsNumber
        const toastAttributes = this.state.toast && { type: this.state.toast.toastType, autoHideDuration: this.state.toast.toastAutoHideDuration, open: this.state.toast.isToastOpen, closeButton: this.state.toast.isToasCloseButton }
        const { children, component, inputs } = this.props
        return (
            <Fragment>
                {inputs && this.global.firebase && <FormDialog isInvalid={isInvalid} inputs={inputs} title='Ajouter un Whisky' mode={EMode.add} onSubmit={this.onSubmit} onChange={this.onChange} />}
                {/* <Sort /> */}
                {children.map((datas: any) => Utils.createComponent(component, datas))}
                <Toast {...toastAttributes}>{this.state.toast && this.state.toast.toastMessage}</Toast>
            </Fragment>
        )
    }

    // TODO : A mettre sur le formulaire ? Pa sur en fait non sur survey
    protected onChange = (e: React.SyntheticEvent) => {
        const field = e.currentTarget.tagName !== 'INPUT' && e.currentTarget.tagName !== 'TEXTAREA' ? (e.currentTarget.parentElement as HTMLElement).querySelector('input') : e.currentTarget as HTMLInputElement
        Utils.formChange(field as HTMLInputElement).then((states: any) => this.setState({ ...states, toast: null }))
    }

    // TODO : A mettre sur le formulaire ? Pas sur en fait plutot sur survey
    protected onSubmit = async (e: React.SyntheticEvent) => {
        if (!Object.keys(this.tables).length || !this.props.inputs || !this.global.firebase) {
            return
        }
        const datas: any = {}
        for (const key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                let value = this.state[key]
                if (value && typeof value === 'string' && value.includes('fakepath')) {
                    value = (document.querySelector('input#' + key) as HTMLElement).getAttribute('data-cloudId')
                }
                if (value !== '' && key.indexOf('valid_') === -1 && key.indexOf('toast') === -1) {
                    if (!datas[this.tables[key]]) {
                        datas[this.tables[key]] = {}
                    }
                    datas[this.tables[key]][key] = value
                }
            }
        }
        const id = this.global.firebase.getKey()
        const username = this.global.user && this.global.user.displayName
        for (let table in datas) {
            if (datas.hasOwnProperty(table)) {
                const data = datas[table]
                if (table.includes('$')) {
                    if (username) {
                        table = table.replace('$user', username)
                    }
                    if (id) {
                        table = table.replace('$key', id)
                    }
                }
                if (username) {
                    data.createdBy = this.global.user.displayName
                }
                this.global.firebase.add(table, data, false, id).then(() => {
                    this.setState({ ...this.initalStates, toast: { isToastOpen: true, toastMessage: 'L\'enregistrement a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
                }).catch((error: any) => {
                    this.setState({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToasCloseButton: true } })
                    console.error(error)
                })
            }
        }
        e.persist()
    }
}

export default List
