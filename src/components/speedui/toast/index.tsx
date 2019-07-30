import React from 'react'
import Utils from '../../../tools/utils'
import Box, { EBoxType } from '../box'
import Button, { EVariant } from '../button'
import Icon from '../icon'
import styles from './toast.module.css'

export enum EToastType { error = 'error', warning = 'warning', info = 'info', success = 'success' }

export enum EToastPosition { top = 'top', topLeft = 'topLeft', topRight = 'topRight', bottom = 'bottom', bottomLeft = 'bottomLeft', bottomRight = 'bottomRight', left = 'left', right = 'right' }

export interface IToastProps {
    type?: EToastType
    autoHideDuration?: number
    closeButton?: boolean
    position?: EToastPosition
    offset?: { x: number, y: number }
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
            <div className={styles.wrapper + ' ' + styles.visibilityOff + ' ' + (this.props.position ? styles[this.props.position] : styles.top)} ref={this.refToaster}>
                <Box className={styles.toast + (type ? ' ' + styles[type] : '')} role='alertDialog' aria-describedby='toaster' type={EBoxType.horizontal}>
                    {type && <Icon name={type} className={styles['icon_' + type]} />}
                    <div>{children}</div>
                    {closeButton && <Button className={styles.close} iconName='cross' label='fermer' handleClick={this.onClose} variant={EVariant.rounded} />}
                </Box>
            </div>
        )
    }

    public componentDidUpdate() {
        if (this.refToaster && this.refToaster.current) {
            const currentToaster = (this.refToaster.current as HTMLElement)
            if (!currentToaster.style.getPropertyValue('--translate-offsetX') && !currentToaster.style.getPropertyValue('--translate-offsetY')) {
                currentToaster.style.setProperty('--translate-offsetX', (this.props.offset && this.props.offset.x || 0) + 'px')
                currentToaster.style.setProperty('--translate-offsetY', (this.props.offset && this.props.offset.y || 0) + 'px')
            }
        }
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
