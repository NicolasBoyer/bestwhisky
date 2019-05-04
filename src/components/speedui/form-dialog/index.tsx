import { createRef, Fragment } from 'react'
import React from 'reactn'
import Button, { EVariant } from '../button'
import Dialog from '../dialog'
import { IFormInput } from '../form'
import Survey from '../survey'
import styles from './form-dialog.module.css'

export enum EFormDialogMode { add = 'add', edit = 'edit' }

export interface IFormDialogProps {
    mode: EFormDialogMode
    title: string
    inputs: IFormInput[]
    datas?: any
    onClose?: (e: React.SyntheticEvent, datas?: any) => void
    onChange?: (e: React.SyntheticEvent, datas?: any) => void
}

interface IFormDialogState {
    isModalOpen: boolean
}

export default class FormDialog extends React.Component<IFormDialogProps, IFormDialogState> {
    protected refOpenButton: React.RefObject<Button> = createRef()

    constructor(props: IFormDialogProps) {
        super(props)
        this.state = { isModalOpen: false }
    }

    public render() {
        const { isModalOpen } = this.state
        const { datas, inputs, mode, title } = this.props
        const cancelButton = <Button label='Annuler' handleClick={this.closeForm} />
        // TODO : renvoyer des styles pour les boutons sur les props
        const openButton = mode === EFormDialogMode.add ? <Button ref={this.refOpenButton} className={styles.addButton} variant={EVariant.fab} label='Ajouter' iconName='add' handleClick={this.openForm} /> : <Button ref={this.refOpenButton} className={styles.editButton} label='Editer' handleClick={this.openForm} />
        return (
            <Fragment>
                {openButton}
                <Dialog title={title} open={isModalOpen} ariaLabel='This is a form dialog' onClose={this.closeForm}>
                    <Survey inputs={inputs} datas={datas} onSubmit={this.accept} onChange={this.props.onChange} buttons={cancelButton} acceptButtonLabel={mode === EFormDialogMode.add ? 'Ajouter' : 'Modifier'} />
                </Dialog>
            </Fragment>
        )
    }

    protected openForm = () => this.setState({ isModalOpen: true })

    protected closeForm = (e: React.SyntheticEvent, datas?: any) => {
        this.setState({ isModalOpen: false })
        if (this.refOpenButton.current) {
            this.refOpenButton.current.focus()
        }
        if (this.props.onClose) {
            this.props.onClose(e, datas)
        }
    }

    protected accept = (e: React.SyntheticEvent, datas: any) => this.closeForm(e, datas)
}
