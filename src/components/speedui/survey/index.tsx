import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import { EFieldType } from '../../speedui/field'
import Form, { IFormInput } from '../../speedui/form'
import { EToastType } from '../../speedui/toast'
import Button from '../button'
import styles from './survey.module.css'

export enum ETableVar { key = '$key', user = '$user' }

export interface ISurveyProps {
    acceptButtonLabel: string
    buttons?: any
    inputs: IFormInput[]
    onChange?: (e: React.SyntheticEvent) => void
    onSubmit?: (e: React.SyntheticEvent) => void
}

class Survey extends React.Component<ISurveyProps, any> {
    initalStates: any = {}
    requiredFieldsNumber: number = 0
    tables: { [str: string]: string } = {}

    constructor(props: ISurveyProps) {
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
        const { acceptButtonLabel, buttons, inputs } = this.props
        return (
            <Fragment>
                {this.global.firebase && <Form inputs={inputs} onSubmit={this.onSubmit} onChange={this.onChange} />}
                <div className={styles.buttons}>
                    {buttons}
                    <Button disabled={isInvalid || false} label={acceptButtonLabel} handleClick={this.onSubmit} />
                </div>
            </Fragment>
        )
    }

    protected onChange = async (e: React.SyntheticEvent) => {
        const field = e.currentTarget.tagName !== 'INPUT' && e.currentTarget.tagName !== 'TEXTAREA' ? (e.currentTarget.parentElement as HTMLElement).querySelector('input') : e.currentTarget as HTMLInputElement
        Utils.formChange(field as HTMLInputElement).then((states: any) => this.setState({ ...states }))
        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    // TODO gestion image par défaut ...
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
                if (value !== '' && key.indexOf('valid_') === -1) {
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
                    this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'L\'enregistrement a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
                }).catch((error: any) => {
                    this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToastCloseButton: true } })
                    console.error(error)
                })
            }
        }
        this.setState({ ...this.initalStates })
        if (this.props.onSubmit) {
            this.props.onSubmit(e)
        }
        e.persist()
    }
}

export default Survey
