import { Link } from '@reach/router'
import React, { Fragment } from 'react'
import Ink from 'react-ink'
import { ERoutes } from '../../../tools/routes'
import Icon from '../icon'
import styles from './button.module.css'

export enum EIconPosition { beforeLabel = 'beforeLabel', afterLabel = 'afterLabel' }

export enum EVariant { fab = 'fab', outlined = 'outlined', contained = 'contained', rounded = 'rounded' }

// TODO : large n'est pas fait !
export enum ESize { small = 'small', normal = 'normal', large = 'large' }

export interface IButtonProps {
    label: string
    iconName?: string
    iconPosition?: EIconPosition
    handleClick: ((e: React.SyntheticEvent) => void) | ERoutes | undefined
    variant?: EVariant
    className?: string
    size?: ESize
    disabled?: boolean
}

// TODO : étudier la possibilité d'avoir des children et dans ce cas le lael serait sur aria-label
// TODO : virer le hover et le outline sur petits écrans
export default class Button extends React.Component<IButtonProps> {
    protected refButton: React.RefObject<HTMLButtonElement> = React.createRef()

    public render() {
        const { className, disabled, handleClick, iconName, iconPosition, label, size, variant } = this.props
        const icon = iconName && <Icon className={styles[iconPosition || ''] + ' ' + styles.icon} name={iconName} />
        const attributes: any = {
            className: (size ? styles[size] : '') + ' ' + (variant ? styles[variant] : '') + ' ' + (!icon && !iconPosition ? styles.textButton : styles.iconButton) + ' ' + styles.light + ' ' + (className ? className : ''),
            disabled,
            tabIndex: 0
        }
        const children = (
            <Fragment>
                {(iconName && !iconPosition || iconName && iconPosition && iconPosition === EIconPosition.beforeLabel) && icon}
                {(!iconName || iconName && iconPosition) && <span className={styles.label}>{label}</span>}
                {(iconName && iconPosition && iconPosition === EIconPosition.afterLabel && label) && icon}
                {!disabled && <Ink />}
            </Fragment>
        )
        if (iconName && !iconPosition) {
            attributes['aria-label'] = label
        }
        return typeof handleClick === 'string' ?
            (
                <Link {...attributes} to={handleClick}>
                    {children}
                </Link>
            ) :
            (
                <button {...attributes} type='button' onBlur={this.onBlur} onClick={this.action} ref={this.refButton}>
                    {children}
                </button>
            )
    }

    public focus = () => this.refButton.current && this.refButton.current.focus()

    private onBlur = () => this.refButton.current && this.refButton.current.classList.remove(styles.hideFocus)

    private action = (e: React.SyntheticEvent) => {
        if (this.refButton.current) {
            this.refButton.current.classList.add(styles.hideFocus)
        }
        if (this.props.handleClick && typeof this.props.handleClick === 'function') {
            this.props.handleClick(e)
        }
    }
}
