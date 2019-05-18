import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'
import { EFieldType } from '../../speedui/field'
import Form, { IFormInput } from '../../speedui/form'
import { EToastType } from '../../speedui/toast'
import Box, { EBoxPosition, EBoxType } from '../box'
import Button from '../button'
import styles from './survey.module.css'

export enum ETableVar { key = '$key', user = '$user' }

export interface ISurveyProps {
    acceptButtonLabel: string
    buttons?: any
    inputs: IFormInput[]
    onChange?: (e: React.SyntheticEvent, datas?: any) => void
    onSubmit?: (e: React.SyntheticEvent, datas?: any) => void
    datas?: any
}

class Survey extends React.Component<ISurveyProps, any> {
    initialStates: any = {}
    requiredFieldsNumber: number = 0
    tables: { [str: string]: string } = {}

    constructor(props: ISurveyProps) {
        super(props)
        if (this.props.inputs) {
            this.props.inputs.forEach((input) => {
                if (input.tables) {
                    this.tables[input.name] = input.tables
                }
                this.initialStates[input.name] = ''
                if (input.required || input.type === EFieldType.email || input.type === EFieldType.url || input.type === EFieldType.password) {
                    this.initialStates['valid_' + input.name] = !input.required
                    this.requiredFieldsNumber++
                }
            })
        }
        this.state = { ...this.initialStates }
    }

    public render() {
        const isInvalid = Object.keys(this.state).filter((key) => this.state[key] === true && key.includes('valid_')).length !== this.requiredFieldsNumber
        const { acceptButtonLabel, buttons, datas, inputs } = this.props
        return (
            <Fragment>
                {this.global.firebase && <Form inputs={inputs} datas={datas} onSubmit={this.onSubmit} onLoad={this.onLoad} onChange={this.onChange} />}
                <Box className={styles.buttons} type={EBoxType.horizontal} position={EBoxPosition.end}>
                    {buttons}
                    <Button disabled={isInvalid || false} label={acceptButtonLabel} handleClick={this.onSubmit} />
                </Box>
            </Fragment>
        )
    }

    protected onChange = async (e: React.SyntheticEvent) => {
        const field = e.currentTarget.tagName !== 'INPUT' && e.currentTarget.tagName !== 'TEXTAREA' ? (e.currentTarget.parentElement as HTMLElement).querySelector('input') : e.currentTarget as HTMLInputElement
        Utils.formChange(field as HTMLInputElement).then((states: any) => {
            this.setState({ ...states })
            if (this.props.onChange) {
                this.props.onChange(e, states)
            }
        })
    }

    protected onLoad = async (e: React.SyntheticEvent) => {
        [].forEach.call(e.currentTarget.querySelectorAll('input, textarea'), (field: HTMLInputElement) => {
            Utils.formChange(field).then((states: any) => this.setState({ ...states }))
        })
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
                const input = (document.querySelector('input#' + key) as HTMLElement)
                const cloudId = input && input.getAttribute('data-cloudId')
                if (cloudId) {
                    value = cloudId
                }
                if (value !== '' && key.indexOf('valid_') === -1) {
                    if (!datas[this.tables[key]]) {
                        datas[this.tables[key]] = {}
                    }
                    datas[this.tables[key]][key] = value
                }
            }
        }
        const id = this.props.datas ? this.props.datas.id : this.global.firebase.getKey()
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
                // Edition
                if (this.props.datas) {
                    this.global.firebase.update(table, data).then(() => {
                        this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'L\'édition a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
                    }).catch((error: any) => {
                        this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToastCloseButton: true } })
                        console.error(error)
                    })
                    // Ajout
                } else {
                    this.global.firebase.add(table, data, false, id).then(() => {
                        this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'L\'enregistrement a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
                    }).catch((error: any) => {
                        this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToastCloseButton: true } })
                        console.error(error)
                    })
                }
            }
        }
        this.setState({ ...this.initialStates })
        if (this.props.onSubmit) {
            let states: any = {}
            for (const table in datas) {
                if (datas.hasOwnProperty(table)) {
                    states = { ...states, ...datas[table] }
                }
            }
            this.props.onSubmit(e, states)
        }
        e.persist()
    }
}

export default Survey
