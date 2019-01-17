import React, { Fragment } from 'react'
import Button, { EVariant } from '../button'
import Dialog from '../dialog'
import Form, { IFormInput } from '../form'
import styles from './form-dialog.module.css'

export enum EMode { add = 'add', edit = 'edit' }

export interface IFormDialogProps {
    mode: EMode
    title: string
    inputs: IFormInput[]
    isInvalid?: boolean
    onChange: (e: React.SyntheticEvent) => void
    onSubmit: (e: React.SyntheticEvent) => void
}

interface IFormDialogState {
    isModalOpen: boolean
}

export default class FormDialog extends React.Component<IFormDialogProps, IFormDialogState> {
    protected refOpenButton: React.RefObject<Button> = React.createRef()

    constructor(props: IFormDialogProps) {
        super(props)
        this.state = { isModalOpen: false }
    }

    public render() {
        const { isModalOpen } = this.state
        const { inputs, isInvalid, mode, onChange, onSubmit, title } = this.props
        const buttons = (
            <Fragment>
                <Button label='Annuler' handleClick={this.closeForm} />
                <Button disabled={isInvalid || false} label={EMode.add ? 'Ajouter' : 'Modifier'} handleClick={this.accept} />
            </Fragment>
        )
        const openButton = mode === EMode.add ? <Button ref={this.refOpenButton} className={styles.addButton} variant={EVariant.fab} label='Ajouter' iconName='add' handleClick={this.openForm} /> : ''
        return (
            <Fragment>
                {openButton}
                <Dialog title={title} open={isModalOpen} buttons={buttons} ariaLabel='This is a form dialog' onClose={this.closeForm}>
                    <Form inputs={inputs} onSubmit={onSubmit} onChange={onChange} />
                </Dialog>
            </Fragment>
        )
    }

    protected openForm = () => this.setState({ isModalOpen: true })

    protected closeForm = () => {
        this.setState({ isModalOpen: false })
        if (this.refOpenButton.current) {
            this.refOpenButton.current.focus()
        }
    }

    protected accept = (e: React.SyntheticEvent) => {
        this.props.onSubmit(e)
        this.closeForm()
    }
}
