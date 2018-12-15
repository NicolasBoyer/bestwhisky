import React from 'react'
import Ink from 'react-ink'
import Icon from '../icon'
import styles from './button.module.css'

export enum EIconPosition { beforeLabel = 'beforeLabel', afterLabel = 'afterLabel' }

export enum EVariant { fab = 'fab', outlined = 'outlined', contained = 'contained', rounded = 'rounded' }

interface IButtonProps {
    label: string
    iconName?: string
    iconPosition?: EIconPosition
    handleClick: (e: React.SyntheticEvent) => void
    variant?: EVariant
    className?: string
}

// TODO : étudier la possibilité d'avoir des children et dans ce cas le lael serait sur aria-label
// TODO : virer le hover et le outline sur petits écrans
export default class Button extends React.Component<IButtonProps> {
    protected refButton: React.RefObject<HTMLButtonElement> = React.createRef()

    public render() {
        const { className, iconName, iconPosition, label, variant } = this.props
        const icon = iconName && <Icon className={styles[iconPosition || ''] + ' ' + styles.icon} name={iconName} />
        const attributes: any = {}
        if (iconName && !iconPosition) {
            attributes['aria-label'] = label
        }
        return (
            <button onBlur={this.onBlur} className={(variant ? styles[variant] : '') + ' ' + (!icon && !iconPosition ? styles.textButton : styles.iconButton) + ' ' + styles.light + ' ' + (className ? className : '')} onClick={this.action} {...attributes} type='button' tabIndex={0} ref={this.refButton}>
                {(iconName && !iconPosition || iconName && iconPosition && iconPosition === EIconPosition.beforeLabel) && icon}
                {(!iconName || iconName && iconPosition) && <span className={styles.label}>{label}</span>}
                {(iconName && iconPosition && iconPosition === EIconPosition.afterLabel && label) && icon}
                <Ink />
            </button>
        )
    }

    public focus = () => this.refButton.current && this.refButton.current.focus()

    private onBlur = () => this.refButton.current && this.refButton.current.classList.remove(styles.hideFocus)

    private action = (e: React.SyntheticEvent) => {
        if (this.refButton.current) {
            this.refButton.current.classList.add(styles.hideFocus)
        }
        this.props.handleClick(e)
    }
}
