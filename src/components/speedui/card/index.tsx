import React from 'react'
import { ERoutes } from '../../../tools/routes'
import Button from '../button'
import styles from './card.module.css'

export interface ICardProps {
    name: string
    isAuth?: boolean
    className?: string
    click?: ((e: React.SyntheticEvent) => void) | ERoutes | string
    edit?: (e: React.SyntheticEvent) => void
    remove?: (e: React.SyntheticEvent) => void
    editButton?: any
    removeButton?: any
    historyState?: any
}

export default class Card extends React.Component<ICardProps> {

    public render() {
        const { editButton, removeButton, name, isAuth, className, children, click, edit, remove, historyState } = this.props
        return (
            <article className={(className ? (className + ' ') : '') + styles.simple}>
                {
                    isAuth && (edit || remove) &&
                    <div className={styles.buttonsActions}>
                        {(edit || editButton) && (editButton || <Button label='Editer' handleClick={edit} />)}
                        {(remove || removeButton) && (removeButton || <Button label='Supprimer' handleClick={remove} />)}
                    </div>
                }
                <h2 className={styles.title}>
                    <span>{name}</span>
                </h2>
                {children}
                {click && <Button className={styles.more} label='En savoir plus' handleClick={click} historyState={historyState} />}
            </article>
        )
    }
}
