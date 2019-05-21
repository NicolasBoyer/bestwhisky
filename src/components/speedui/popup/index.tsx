import React from 'react'
import ReactDOM from 'react-dom'
import Utils from '../../../tools/utils'
import styles from './popup.module.css'

export enum EPopupAnchorPosition { top = 'top', left = 'left', bottom = 'bottom', right = 'right' }

interface IAnchorPosition { element: any, position: EPopupAnchorPosition }

interface IAbsolutePosition { top: number, left: number }

export interface IPopupProps {
    role?: string
    open: boolean
    onClose: (e: React.SyntheticEvent) => void
    preventHideOnMaskTap?: boolean
    anchor: IAnchorPosition | IAbsolutePosition
    isTooltip?: boolean
    className?: string
}

export default class Popup extends React.Component<IPopupProps> {
    protected refContainer: React.RefObject<HTMLDivElement> = React.createRef()

    public shouldComponentUpdate(props: Readonly<IPopupProps>) {
        if (props.open !== this.props.open && !this.props.isTooltip) {
            (document.querySelector('html') as HTMLElement).classList.toggle(styles.scrollLock)
            const domPopup = document.querySelector('aside')
            if (domPopup) {
                domPopup.childNodes.forEach((child) => Utils.toggleClass(child as HTMLElement, styles.opacityOn, styles.opacityOff))
                setTimeout(() => this.forceUpdate(), 225)
                return false
            }
        }
        return true
    }

    public render() {
        const { children, open, role } = this.props
        if (!open) {
            return null
        }
        // TODO créer un Portal qui retourne juste ça + ou popup est juste une fenetre en popup à laquelle on donne top et left et tooltip contient bouton et popup ou change nom popup en tooltip
        return ReactDOM.createPortal(
            this.props.isTooltip ?
                <div className={(this.props.className ? this.props.className + ' ' : '') + styles.tooltip + ' ' + styles.opacityOff} role={'tooltip'} tabIndex={-1} ref={this.refContainer}>
                    {children}
                </div> :
                <aside className={(this.props.className ? this.props.className + ' ' : '') + styles.popup} role={role || 'presentation'} onClick={this.onClickAway}>
                    <div className={styles.background} aria-hidden='true' />
                    <div className={styles.container + ' ' + styles.opacityOff} role='document' tabIndex={-1} ref={this.refContainer}>
                        {children}
                    </div>
                </aside>,
            document.body
        )
    }

    public componentDidUpdate(props: IPopupProps) {
        if (props.open !== this.props.open && this.refContainer.current) {
            Utils.toggleClass(this.refContainer.current as HTMLElement, styles.opacityOff, styles.opacityOn)
            let top = 0
            let left = 0
            if ('top' in this.props.anchor) {
                top = this.props.anchor.top
                left = this.props.anchor.left
            } else {
                const buttonSize = this.props.anchor.element.getBoundingClientRect()
                const tooltipSize = this.refContainer.current.getBoundingClientRect()
                switch (this.props.anchor.position) {
                    case EPopupAnchorPosition.top:
                        left = buttonSize.left + buttonSize.width / 2 - tooltipSize.width / 2
                        top = buttonSize.top - tooltipSize.height
                        break
                    case EPopupAnchorPosition.right:
                        left = buttonSize.left + buttonSize.width
                        top = buttonSize.top + buttonSize.height / 2 - tooltipSize.height / 2
                        break
                    case EPopupAnchorPosition.left:
                        left = buttonSize.left - tooltipSize.width
                        top = buttonSize.top + buttonSize.height / 2 - tooltipSize.height / 2
                        break
                    default:
                        left = buttonSize.left + buttonSize.width / 2 - tooltipSize.width / 2
                        top = buttonSize.top + buttonSize.height
                        break
                }
            }
            this.refContainer.current.style.top = top + 'px'
            this.refContainer.current.style.left = left + 'px'
        }
    }

    protected onClickAway = (e: React.SyntheticEvent) => !this.props.preventHideOnMaskTap && this.props.onClose(e)
}
