import React, { createRef } from 'react'
import Utils from '../../../tools/utils'
import Box, { EBoxPosition, EBoxType } from '../box'
import Button from '../button'
import Icon from '../icon'
import PopupButton from '../popup-button'
import styles from './search.module.css'

export enum ESearchKeyOrder { asc = 'asc', desc = 'desc' }

export interface ISearchProps {
    onChange: ((datas: any) => void)
    datas: any
    fields: string[]
    sortKey?: string
    placeHolder?: string
    sortKeyOrder?: ESearchKeyOrder
    facets?: any
}

interface ISearchState {
    isResetButtonVisible: boolean
    isActive: boolean
    isFacetsOpen: boolean
    facetsTop: number
    facetsLeft: number
}

export default class Search extends React.Component<ISearchProps, ISearchState> {
    protected refInput: React.RefObject<HTMLInputElement> = createRef()
    protected datas: any = this.props.datas
    protected initialDatas: any
    protected sortKey: any
    protected sortKeyOrder: any

    constructor(props: ISearchProps) {
        super(props)
        this.state = { isResetButtonVisible: false, isActive: false, isFacetsOpen: false, facetsLeft: 0, facetsTop: 0 }
    }

    public render() {
        return (
            <Box type={EBoxType.horizontal} position={EBoxPosition.end} className={styles.searchBox}>
                <form className={styles.form} role='search' onSubmit={(e) => e.preventDefault()}>
                    <input type='search' placeholder={this.props.placeHolder} onChange={this.onChange} autoComplete='off' autoCorrect='off' autoCapitalize='off' ref={this.refInput} required />
                    <Icon name='search' className={styles.searchIcon} />
                    <Button className={styles.reset + (this.state.isResetButtonVisible ? ' ' + styles.isVisible : '')} iconName='cross' label='Reset' handleClick={this.reset} />
                </form>
                {this.props.facets &&
                    <PopupButton className={styles.facetsButton} label='Facettes' iconName='sliders'>
                        test à la con {this.props.facets}
                    </PopupButton>
                }
            </Box>
        )
    }

    protected onChange = () => {
        if (this.refInput.current) {
            const currentValue = this.refInput.current.value
            if (!this.state.isActive && currentValue.length === 1) {
                // Permet de remettre les données comme envoyées avant le sort si pas de changement de sort pendant la recherche grace a isActive
                this.initialDatas = Array.from(this.props.datas)
            }
            this.setState({ isResetButtonVisible: this.refInput.current.value !== '' })
            const results: any = []
            if (currentValue !== '') {
                const requestResults: any = {}
                // Sort by key
                if (this.sortKey !== this.props.sortKey || this.sortKeyOrder !== this.props.sortKeyOrder) {
                    this.sortKey = this.props.sortKey
                    this.sortKeyOrder = this.props.sortKeyOrder
                    Utils.sortObjectsArrayByKey(this.datas, this.props.sortKey, this.props.sortKeyOrder || ESearchKeyOrder.asc)
                    if (this.state.isActive) {
                        this.initialDatas = this.datas
                    }
                }
                // Searching request
                this.props.fields.forEach((field) => {
                    this.datas.forEach((child: any) => {
                        if (String(child[field]).toLowerCase().includes(currentValue.toLowerCase()) && child.key) {
                            requestResults[child.key] = { ...child }
                        }
                    })
                })
                // Hihglight term
                this.datas.forEach((data: any) => {
                    if (requestResults[data.key]) {
                        this.props.fields.forEach((field) => {
                            requestResults[data.key][field] = data[field].replace(new RegExp('(' + currentValue + ')', 'gi'), '~s§s§$1~s')
                        })
                        // Nécessaire pour que les résultats soient dans l'ordre des datas défini dans sortByKey
                        results.push(requestResults[data.key])
                    }
                })
            }
            this.setState({ isActive: currentValue.length > 0 })
            this.props.onChange(results.length ? results : this.initialDatas)
        }
    }

    protected reset = () => {
        if (this.refInput.current) {
            this.refInput.current.value = ''
            Utils.sortObjectsArrayByKey(this.datas, this.props.sortKey, this.props.sortKeyOrder || ESearchKeyOrder.asc)
            this.props.onChange(this.datas)
        }
        this.setState({ isResetButtonVisible: false })
    }
}
