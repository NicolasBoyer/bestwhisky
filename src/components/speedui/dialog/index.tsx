import FocusTrap from 'focus-trap-react'
import React from 'react'
import ReactDOM from 'react-dom'
import Utils from '../../../tools/utils'
import styles from './dialog.module.css'

export interface IDialogProps {
    ariaLabel: string
    buttons?: any
    role?: string
    title: string
    open: boolean
    onClose: (e: React.SyntheticEvent) => void
    preventHideOnMaskTap?: boolean
}

export default class Dialog extends React.Component<IDialogProps> {
    protected refDialogWindow: React.RefObject<HTMLDivElement> = React.createRef()
    protected refBackground: React.RefObject<HTMLDivElement> = React.createRef()
    protected refContainer: React.RefObject<HTMLDivElement> = React.createRef()

    public shouldComponentUpdate(props: Readonly<IDialogProps>) {
        if (props.open !== this.props.open) {
            (document.querySelector('html') as HTMLElement).classList.toggle(styles.scrollLock)
            const domDialog = document.querySelector('aside')
            if (domDialog) {
                domDialog.childNodes.forEach((child) => Utils.toggleClass(child as HTMLElement, styles.opacityOn, styles.opacityOff))
                setTimeout(() => this.forceUpdate(), 225)
                return false
            }
        }
        return true
    }

    public render() {
        const { ariaLabel, buttons, children, open, role, title } = this.props
        if (!open) {
            return null
        }
        return ReactDOM.createPortal(
            <FocusTrap>
                <aside className={styles.dialog} aria-modal='true' tabIndex={-1} role={role || 'dialog'} aria-labelledby={ariaLabel} onClick={this.onClickAway}>
                    <div className={styles.background + ' ' + styles.opacityOff} aria-hidden='true' ref={this.refBackground} />
                    <div className={styles.container + ' ' + styles.opacityOff} role='document' tabIndex={-1} ref={this.refContainer}>
                        <div className={styles.dialogWindow} ref={this.refDialogWindow}>
                            <h2 className={styles.title}>
                                <span>{title}</span>
                            </h2>
                            <div className={styles.content}>
                                {children}
                            </div>
                            {buttons && <div className={styles.buttons}>{buttons}</div>}
                        </div>
                    </div>
                </aside>
            </FocusTrap>,
            document.body
        )
    }

    public componentDidUpdate(props: IDialogProps) {
        if (props.open !== this.props.open) {
            Utils.toggleClass(this.refBackground.current as HTMLElement, styles.opacityOff, styles.opacityOn)
            Utils.toggleClass(this.refContainer.current as HTMLElement, styles.opacityOff, styles.opacityOn)
        }
    }

    protected onClickAway = (e: React.SyntheticEvent) => (this.refDialogWindow.current && !this.refDialogWindow.current.contains(e.target as HTMLElement)) && !this.props.preventHideOnMaskTap && this.props.onClose(e)
}
