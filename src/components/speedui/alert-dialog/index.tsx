import React from 'react'
import Button from '../button'
import Dialog from '../dialog'
import styles from './alert-dialog.module.css'

export enum EDialogAlertType { alert = 'alert', confirm = 'confirm', prompt = 'prompt' }

export interface IAlertDialogProps {
    accept?: (e: React.SyntheticEvent) => void
    onClose?: (e: React.SyntheticEvent) => void
    title: string
    message?: string
    open: boolean
    type: EDialogAlertType
}

interface IAlertDialogState {
    isModalOpen: boolean
}

export default class AlertDialog extends React.Component<IAlertDialogProps, IAlertDialogState> {

    constructor(props: IAlertDialogProps) {
        super(props)
        this.state = { isModalOpen: false }
    }

    public shouldComponentUpdate(props: Readonly<IAlertDialogProps>) {
        if (props.open !== this.props.open) {
            this.setState({ isModalOpen: props.open })
        }
        return true
    }

    public render() {
        const { isModalOpen } = this.state
        const { message, title, type } = this.props
        const acceptButton = type !== EDialogAlertType.prompt && <Button label={type === EDialogAlertType.alert ? 'Ok' : 'Accepter'} handleClick={this.accept} />
        const cancelButton = type !== EDialogAlertType.alert && <Button label={type === EDialogAlertType.prompt ? 'Fermer' : 'Annuler'} handleClick={this.closeForm} />
        return (
            <Dialog title={title} open={isModalOpen} ariaLabel='This is an alert dialog' onClose={this.closeForm} preventHideOnMaskTap={type === EDialogAlertType.alert}>
                {message && <div className={styles.message}>{message}</div>}
                {
                    (acceptButton || cancelButton) && <div className={styles.buttons + ' ' + (type !== EDialogAlertType.confirm && styles.oneButton)}>{cancelButton} {acceptButton}</div>
                }
            </Dialog>
        )
    }

    protected accept = (e: React.SyntheticEvent) => {
        this.setState({ isModalOpen: false }, () => {
            setTimeout(() => {
                if (this.props.accept) {
                    this.props.accept(e)
                }
            }, 225)
        })
    }

    protected closeForm = (e: React.SyntheticEvent) => {
        this.setState({ isModalOpen: false }, () => {
            setTimeout(() => {
                if (this.props.onClose) {
                    this.props.onClose(e)
                }
            }, 225)
        })
    }
}
