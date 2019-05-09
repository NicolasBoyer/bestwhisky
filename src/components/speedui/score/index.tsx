import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import Button, { ESize } from '../../speedui/button'
import Box, { EBoxType } from '../box'
import styles from './score.module.css'

export interface IScoreProps {
    maxScore: number
    onChange: (e: React.SyntheticEvent, value: number) => void
    minScore?: number
    required?: boolean
}

interface IScoreState {
    value: number
}

export default class Score extends React.Component<IScoreProps, IScoreState> {
    protected refScore: React.RefObject<Box> = React.createRef()

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
            <Box type={EBoxType.reverseHorizontal} className={styles.score} ref={this.refScore}>
                {scores.reverse().map((value) =>
                    <Fragment key={value}>
                        {
                            this.state.value - value < 1 && this.state.value - value > 0 &&
                            <Helmet>
                                <style>
                                    {`
                                        :root {
                                            --note: ${(this.state.value - value) * 100}%;
                                        }
                                    `}
                                </style>
                            </Helmet>
                        }
                        <Button className={styles.note + (value + 1 <= this.state.value ? ' ' + styles.selected : this.state.value - value < 1 && this.state.value - value > 0 ? ' ' + styles.float : '')} label={'star_' + (value + 1)} iconName='star-full' handleClick={(e) => this.onChange(e, value + 1)} size={ESize.small} />
                    </Fragment>
                )}
                <input type='hidden' value={this.state.value} id='note' required={required} />
            </Box>
        )
    }

    public setValue = (value: number) => this.setState({ value })

    public getValue = () => this.state.value

    protected onChange(e: React.SyntheticEvent, index: number) {
        if (this.refScore.current) {
            const buttons = (this.refScore.current as any).querySelectorAll('button')
            buttons.forEach((button: any, position: number) => {
                if (index <= buttons.length - position - 1) {
                    (button as HTMLElement).classList.remove(styles.selected)
                } else {
                    (button as HTMLElement).classList.add(styles.selected)
                }
            })
        }
        this.setState({ value: index })
        this.props.onChange(e, index)
    }
}
