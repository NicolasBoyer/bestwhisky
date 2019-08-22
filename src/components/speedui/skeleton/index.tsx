import React from 'react'
import Utils from '../../../tools/utils'
import styles from './skeleton.module.css'

export enum ESkeletonVariant { rect = 'rect', circle = 'circle', text = 'text' }

export interface ISkeletonProps {
    variant?: ESkeletonVariant
    width?: number
    height?: number
    tag?: any
    className?: string
    borderRadius?: boolean
    repeat?: number
}

export default class Skeleton extends React.Component<ISkeletonProps> {
    public render() {
        const { borderRadius, className, height, repeat, tag, variant, width } = this.props
        return [...new Array(repeat || 1)].map(() => Utils.createComponent(tag || 'div', { style: { width: width + 'rem', height: height + 'rem' }, className: styles[variant || 'rect'] + (className ? ' ' + className : '') + (borderRadius ? ' ' + styles.borderRadius : ''), key: Utils.generateId() }, variant === ESkeletonVariant.text ? [...new Array(Math.round((height || 1.2) / 1.2))].map(() => <div key={Utils.generateId()}></div>) : null))
    }
}
