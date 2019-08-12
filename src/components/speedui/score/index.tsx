import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import Button, { ESize } from '../../speedui/button'
import Box, { EBoxType } from '../box'
import Icon from '../icon'
import styles from './score.module.css'

export interface IScoreProps {
    maxScore?: number
    onChange?: (e: React.SyntheticEvent, value: number) => void
    minScore?: number
    required?: boolean
    readonly?: boolean
    note: number
}

interface IScoreState {
    value: number
}

export default class Score extends React.Component<IScoreProps, IScoreState> {
    constructor(props: IScoreProps) {
        super(props)
        this.state = { value: props.note }
    }

    public render() {
        const { maxScore, minScore, readonly, required } = this.props
        const scores: number[] = []
        for (let i = minScore || 0; i < (maxScore || 5); i++) {
            scores.push(i)
        }
        return (
            <Box type={EBoxType.reverseHorizontal} className={styles.score}>
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
                        {
                            readonly
                                ?
                                <div className={styles.readonly + ' ' + styles.note + (value + 1 <= this.state.value ? ' ' + styles.selected : this.state.value - value < 1 && this.state.value - value > 0 ? ' ' + styles.float : '')}>
                                    <Icon className={styles.readonlyIcon} name='star-full'></Icon>
                                </div>
                                :
                                <Button className={styles.note + (value + 1 <= this.state.value ? ' ' + styles.selected : this.state.value - value < 1 && this.state.value - value > 0 ? ' ' + styles.float : '')} label={'star_' + (value + 1)} iconName='star-full' handleClick={(e) => this.onChange(e, value + 1)} size={ESize.small} />
                        }
                    </Fragment>
                )}
                <input type='hidden' value={this.state.value} id='note' required={required} />
            </Box>
        )
    }

    public setValue = (value: number) => this.setState({ value })

    public getValue = () => this.state.value

    protected onChange(e: React.SyntheticEvent, index: number) {
        this.setState({ value: index })
        if (this.props.onChange) {
            this.props.onChange(e, index)
        }
    }
}
