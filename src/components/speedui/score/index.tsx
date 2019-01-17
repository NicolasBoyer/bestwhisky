import React from 'react'
import Button, { ESize } from '../../speedui/button'
import styles from './score.module.css'

export interface IScoreProps {
    maxScore: number
    onChange: (e: React.SyntheticEvent) => void
    minScore?: number
    saveOnClick?: boolean
}

// export interface IAppState {
// }

export default class Score extends React.Component<IScoreProps> {
    protected refScore: React.RefObject<HTMLDivElement> = React.createRef()

    public render() {
        const { maxScore, minScore } = this.props
        const scores: number[] = []
        for (let i = minScore || 0; i < maxScore; i++) {
            scores.push(i)
        }
        return (
            <div className={styles.score} ref={this.refScore} id='note'>
                {scores.reverse().map((value) => <Button className={styles.note} key={value} label={'star_' + (value + 1)} iconName='star-full' handleClick={(e) => this.onChange(value + 1, e)} size={ESize.small} />)}
            </div>
        )
    }

    protected onChange(index: number, e: React.SyntheticEvent) {
        if (this.refScore.current) {
            // TODO : a transformer en fonction pour l'edit
            const buttons = this.refScore.current.childNodes
            buttons.forEach((button, position) => {
                if (index <= buttons.length - position - 1) {
                    (button as HTMLElement).classList.remove(styles.selected)
                } else {
                    (button as HTMLElement).classList.add(styles.selected)
                }
            })
            this.props.onChange(e)
        }
        console.log(index)
    }
}
