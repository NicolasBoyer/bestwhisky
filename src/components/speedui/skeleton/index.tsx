import React from 'react'
import Utils from '../../../tools/utils'
import styles from './skeleton.module.css'

export enum ESkeletonVariant { rect = 'rect', circle = 'circle' }

export interface ISkeletonProps {
    variant?: ESkeletonVariant
    width?: number
    height?: number
    tag?: any
    className?: string
    spacing?: { top?: number, right?: number, bottom?: number, left?: number }
    borderRadius?: number
    // TODO à finir
    repeat?: number
}

export default class Skeleton extends React.Component<ISkeletonProps> {
    public render() {
        const { borderRadius, className, height, repeat, spacing, tag, variant, width } = this.props
        const margin = spacing ? (spacing.top || 0) + 'rem ' + (spacing.right || 0) + 'rem ' + (spacing.bottom || 0) + 'rem ' + (spacing.left || 0) + 'rem' : ''
        // return new Array(repeat || 1).map(() => Utils.createComponent(tag || 'div', { style: { width: width + 'rem', height: height + 'rem', margin, borderRadius: borderRadius + 'rem' }, className: styles[variant || 'rect'] + (className ? ' ' + className : '') }))
        return Utils.createComponent(tag || 'div', { style: { width: width + 'rem', height: height + 'rem', margin, borderRadius: borderRadius + 'rem' }, className: styles[variant || 'rect'] + (className ? ' ' + className : '') })
    }
}
