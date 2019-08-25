import React from 'react'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import Score from '../../speedui/score'
import styles from './note.module.css'

interface INoteProps {
    views: Array<{ author: string, stars: number, view?: string }>
    readonly?: boolean
    className?: string
    onChange?: (e: React.SyntheticEvent, value: number) => void
}

export default class Note extends React.Component<INoteProps> {
    protected refScore: React.RefObject<Score> = React.createRef()

    public render() {
        const { className, onChange, readonly, views } = this.props
        if (!views || !views.length) {
            return null
        }
        return (
            <Box className={(className ? className + ' ' : '') + styles.note} type={EBoxType.horizontal} position={EBoxPosition.start}>
                <Score readonly={readonly} note={this.computeScore()} onChange={onChange} ref={this.refScore} />
                <span className={styles.views}>{views.length + ' avis'}</span>
            </Box>
        )
    }

    public componentDidUpdate() {
        if (this.refScore.current) {
            this.refScore.current.setValue(this.computeScore())
        }
    }

    protected computeScore() {
        return this.props.views.reduce((sum, view) => sum + Number(view.stars), 0) / this.props.views.length
    }
}
