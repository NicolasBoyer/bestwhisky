import React, { createRef } from 'react'
import Button from '../button'
import Icon from '../icon'
import styles from './search.module.css'

export interface ISearchProps {
    onChange: ((e: React.SyntheticEvent, currentValue: string) => void)
    placeHolder?: string
}

interface ISearchState {
    isResetButtonVisible: boolean
}

export default class Search extends React.Component<ISearchProps, ISearchState> {
    protected refInput: React.RefObject<HTMLInputElement> = createRef()

    constructor(props: ISearchProps) {
        super(props)
        this.state = { isResetButtonVisible: false }
    }

    public render() {
        return (
            <form className={styles.form} role='search' onSubmit={(e) => e.preventDefault()}>
                <input type='search' placeholder={this.props.placeHolder} onChange={this.onChange} autoComplete='off' autoCorrect='off' autoCapitalize='off' ref={this.refInput} required />
                <Icon name='search' className={styles.searchIcon} />
                <Button className={styles.reset + (this.state.isResetButtonVisible ? ' ' + styles.isVisible : '')} iconName='cross' label='Reset' handleClick={this.reset} />
            </form>
        )
    }

    protected onChange = (e: React.SyntheticEvent) => {
        if (this.refInput.current) {
            this.setState({ isResetButtonVisible: this.refInput.current.value !== '' })
            this.props.onChange(e, this.refInput.current.value)
        }
    }

    protected reset = (e: React.SyntheticEvent) => {
        if (this.refInput.current) {
            this.refInput.current.value = ''
            this.props.onChange(e, this.refInput.current.value)
        }
        this.setState({ isResetButtonVisible: false })
    }
}
