import React from 'react'
import Utils from '../../../tools/utils'
import Field, { EFieldType } from '../field'
import styles from './sort.module.css'

export interface ISortProps {
    onChange: ((datas: any, sortKey: string, sortKeyOrder: string) => void)
    entries: Array<{ name: string, value: string }>
    datas: any
    defaultValue: string // forme string-asc ou string-desc
}

interface ISortState {
    currentValue: string
    datas: any
}

export default class Sort extends React.Component<ISortProps, ISortState> {
    protected datas: any = this.props.datas

    constructor(props: ISortProps) {
        super(props)
        this.state = { currentValue: props.defaultValue, datas: null }
    }

    public render() {
        Utils.sortObjectsArrayByKey(this.datas, this.state.currentValue.substring(0, this.state.currentValue.lastIndexOf('-')), this.state.currentValue.substring(this.state.currentValue.lastIndexOf('-') + 1))
        return (
            <Field className={styles.select} options={this.props.entries} type={EFieldType.select} name='Sort' value={this.state.currentValue} onChange={this.onChange} />
        )
    }

    protected onChange = (e: React.SyntheticEvent) => {
        const select = e.target as HTMLSelectElement
        this.setState({ currentValue: select.value })
        const sortKey = select.value.substring(0, select.value.lastIndexOf('-'))
        const sortKeyOrder = select.value.substring(select.value.lastIndexOf('-') + 1)
        const results: any = []
        Utils.sortObjectsArrayByKey(this.datas, sortKey, sortKeyOrder)
        this.datas.forEach((data: any) => {
            const sortData = this.props.datas.find((obj: any) => obj.key === data.key)
            if (sortData) {
                results.push(sortData)
            }
        })
        this.props.onChange(results, sortKey, sortKeyOrder)
    }
}
