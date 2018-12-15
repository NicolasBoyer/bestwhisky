import React from 'react'
import styles from './loader.module.css'

export enum ELoaderType { spinner = 'spinner' }

export interface ILoaderProps {
    type?: ELoaderType
    progress?: number
}

export default class Loader extends React.Component<ILoaderProps> {
    public render() {
        const { progress, type } = this.props
        let circleStyle: React.CSSProperties | undefined
        if (progress) {
            circleStyle = { strokeDashoffset: 126 - (progress * 126) / 100 + 'px' }
        }
        return (
            <div className={styles.wrapper}>
                <div className={styles[type ? 'container_' + type : 'container_spinner'] + (progress ? ' ' + styles.progress : '')} aria-valuenow={progress} role='progressbar'>
                    <svg viewBox='22 22 44 44'>
                        <circle className={styles[type ? 'container_' + type : 'spinner']} style={circleStyle} cx='44' cy='44' r='20.2' fill='none' strokeWidth='3.6'></circle>
                    </svg>
                </div>
            </div>
        )
    }
}
