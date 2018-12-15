import React from 'react'
import Button from '../button'
import styles from './card.module.css'

// tslint:disable-next-line:variable-name
const Card = (props: { name: string, children?: any, loadMoreButton?: boolean, clickAction: (e: React.SyntheticEvent) => void }) => {
    return (
        <article className={styles.simple}>
            <h2 className={styles.title}>
                <span>{props.name}</span>
            </h2>
            <div className={styles.content + (props.loadMoreButton ? ' ' + styles.hasButton : '')}>
                {props.children}
            </div>
            {props.loadMoreButton && <Button label='En savoir plus' handleClick={props.clickAction} />}
        </article>
    )
}

export default Card
