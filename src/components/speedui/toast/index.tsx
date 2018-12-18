import React from 'react'
import Utils from '../../../tools/utils'
import Button, { EVariant } from '../button'
import Icon from '../icon'
import styles from './toast.module.css'

export enum EToastType { error = 'error', warning = 'warning', info = 'info', success = 'success' }

// TODO gérer les Positions left right et bottom !

export interface IToastProps {
    type?: EToastType
    autoHideDuration?: number
    closeButton?: boolean
    open: boolean
}

interface IToastState {
    isOpen: boolean
}

export default class Toast extends React.Component<IToastProps, IToastState> {
    protected refToaster: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: IToastProps) {
        super(props)
        this.state = { isOpen: false }
    }

    public shouldComponentUpdate(props: Readonly<IToastProps>, state: Readonly<IToastState>) {
        if (props.open !== this.state.isOpen) {
            this.setState({ isOpen: props.open })
            if (state.isOpen && props.open && props.autoHideDuration) {
                setTimeout(() => {
                    Utils.toggleClass(document.querySelector('div.' + styles.wrapper) as HTMLElement, styles.visibilityOn, styles.visibilityOff)
                }, props.autoHideDuration * 1000 - 225)
                setTimeout(() => {
                    this.setState({ isOpen: false })
                }, props.autoHideDuration * 1000)
            }
        }
        return true
    }

    public render() {
        const { children, closeButton, type } = this.props
        if (!this.state.isOpen) {
            return null
        }
        return (
            <div className={styles.wrapper + ' ' + styles.visibilityOff} ref={this.refToaster}>
                <div className={styles.toast + (type ? ' ' + styles[type] : '')} role='alertDialog' aria-describedby='toaster'>
                    {type && <Icon name={type} className={styles['icon_' + type]} />}
                    <span>{children}</span>
                    {closeButton && <Button className={styles.close} iconName='cross' label='fermer' handleClick={this.onClose} variant={EVariant.rounded} />}
                </div>
            </div>
        )
    }

    public componentDidUpdate() {
        setTimeout(() => {
            Utils.toggleClass(this.refToaster.current as HTMLElement, styles.visibilityOff, styles.visibilityOn)
        }, 225)
    }

    protected onClose = () => {
        Utils.toggleClass(this.refToaster.current as HTMLElement, styles.visibilityOn, styles.visibilityOff)
        setTimeout(() => {
            this.setState({ isOpen: false })
        }, 225)
    }
}

// firebase connexion
