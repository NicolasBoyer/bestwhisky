import React from 'react'
import styles from './box.module.css'

export enum EBoxType { horizontal = 'horizontal', vertical = 'vertical', aroundFirstLeft = 'aroundFirstLeft', aroundFirstRight = 'aroundFirstRight' }

export enum EBoxPosition { start = 'start', end = 'end', center = 'center', spaceBetween = 'spaceBetween', spaceAround = 'spaceAround', spaceEvenly = 'spaceEvenly' }

// tslint:disable-next-line:variable-name
const Box = (props: { type: string, position?: string, children: any, className?: string, id?: string }) => {
    return (
        <div id={props.id} className={styles[props.type] + (props.position ? ' ' + styles[props.position] : '') + (props.className ? ' ' + props.className : '')}>
            {props.children}
        </div>
    )
}

export default Box
