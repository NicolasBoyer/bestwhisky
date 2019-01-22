import React from 'react'
import Button, { ESize } from '../../speedui/button'
import styles from './score.module.css'

export interface IScoreProps {
    maxScore: number
    onChange: (e: React.SyntheticEvent) => void
    minScore?: number
    saveOnClick?: boolean
    required?: boolean
}

interface IScoreState {
    value: number
}

export default class Score extends React.Component<IScoreProps, IScoreState> {
    protected refScore: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: IScoreProps) {
        super(props)
        this.state = { value: 0 }
    }

    public render() {
        const { maxScore, minScore, required } = this.props
        const scores: number[] = []
        for (let i = minScore || 0; i < maxScore; i++) {
            scores.push(i)
        }
        return (
            <div className={styles.score} ref={this.refScore}>
                {scores.reverse().map((value) => <Button className={styles.note} key={value} label={'star_' + (value + 1)} iconName='star-full' handleClick={(e) => this.onChange(value + 1, e)} size={ESize.small} />)}
                <input type='hidden' value={this.state.value} id='note' required={required} />
            </div>
        )
    }

    protected onChange(index: number, e: React.SyntheticEvent) {
        if (this.refScore.current) {
            // TODO : a transformer en fonction pour l'edit
            const buttons = this.refScore.current.querySelectorAll('button')
            buttons.forEach((button, position) => {
                if (index <= buttons.length - position - 1) {
                    (button as HTMLElement).classList.remove(styles.selected)
                } else {
                    (button as HTMLElement).classList.add(styles.selected)
                }
            })
            this.setState({ value: index })
            this.props.onChange(e)
        }
    }
}
