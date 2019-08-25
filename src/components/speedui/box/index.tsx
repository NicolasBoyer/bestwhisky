import React from 'react'
import Utils from '../../../tools/utils'
import styles from './box.module.css'

export enum EBoxType { horizontal = 'horizontal', vertical = 'vertical', reverseHorizontal = 'reverseHorizontal', reverseVertical = 'reverseVertical', aroundFirstLeft = 'aroundFirstLeft', aroundFirstRight = 'aroundFirstRight', inline = 'inline' }

export enum EBoxPosition { start = 'start', end = 'end', center = 'center', spaceBetween = 'spaceBetween', spaceAround = 'spaceAround', spaceEvenly = 'spaceEvenly' }

export interface IBoxProps {
    type: EBoxType
    position?: EBoxPosition
    children: any
    className?: string
    id?: string
    tag?: any
    role?: string
}

export default class Box extends React.Component<IBoxProps> {
    public render() {
        return Utils.createComponent(this.props.tag || 'div', { id: this.props.id, className: styles[this.props.type] + (this.props.position ? ' ' + styles[this.props.position] : '') + (this.props.className ? ' ' + this.props.className : '') }, this.props.children)
    }
}
