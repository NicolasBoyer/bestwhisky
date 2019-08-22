import React, { createRef, Fragment } from 'react'
import Utils from '../../../tools/utils'
import Box, { EBoxPosition, EBoxType } from '../box'
import Button from '../button'
import Field, { EFieldType } from '../field'
import Icon from '../icon'
import PopupButton from '../popup-button'
import Toast, { EToastPosition } from '../toast'
import styles from './search.module.css'

export enum ESearchKeyOrder { asc = 'asc', desc = 'desc' }

// TODO à augmenter quand nécessaire
export enum EFacetsType { checkbox = 'checkbox', inBetween = 'inBetween', slider = 'slider', select = 'select' }

export interface ISearchProps {
    onChange: ((datas: any) => void)
    datas: any
    fields: string[]
    sortKey?: string
    placeHolder?: string
    sortKeyOrder?: ESearchKeyOrder
    facets?: any
    facetsAlwaysVisible?: boolean
}

interface ISearchState {
    isResetButtonVisible: boolean
    isFacetsOpen: boolean
    facetsTop: number
    facetsLeft: number
    facets: any
}

export default class Search extends React.Component<ISearchProps, ISearchState> {
    protected refInput: React.RefObject<HTMLInputElement> = createRef()
    protected datas: any = this.props.datas
    protected filteredDatas = this.props.datas
    protected filter: string[] = []
    protected facetsDatas: any = {}
    protected initialInBetweenFacetTargetValue: any = {}
    protected sortKey: any
    protected sortKeyOrder: any

    constructor(props: ISearchProps) {
        super(props)
        this.state = { isResetButtonVisible: false, isFacetsOpen: false, facetsLeft: 0, facetsTop: 0, facets: [] }
    }

    public componentDidMount = () => document.body.addEventListener('databaseEndAccess', () => this.buildFacets())

    public render() {
        return (
            <Box type={EBoxType.horizontal} position={EBoxPosition.end} className={styles.searchBox}>
                <form className={styles.form} role='search' onSubmit={(e) => e.preventDefault()}>
                    <input type='search' placeholder={this.props.placeHolder} onChange={this.onChange} autoComplete='off' autoCorrect='off' autoCapitalize='off' ref={this.refInput} required />
                    <Icon name='search' className={styles.searchIcon} />
                    <Button className={styles.reset + (this.state.isResetButtonVisible ? ' ' + styles.isVisible : '')} iconName='cross' label='Reset' handleClick={this.resetFullText} />
                </form>
                {this.props.facetsAlwaysVisible &&
                    <Box type={EBoxType.vertical}>
                        {this.state.facets}
                    </Box>
                }
                {this.props.facets && !this.props.facetsAlwaysVisible &&
                    <Fragment>
                        <PopupButton disabled={!this.filteredDatas.length} allowScroll={true} className={styles.facetsButton} label='Facettes' iconName='sliders' onBeforeOpen={this.buildFacets}>
                            {this.state.facets}
                        </PopupButton>
                        {
                            <Toast open={this.filter.length !== 0} position={EToastPosition.bottom} closeButton={true} onClose={this.resetFilter}>
                                <Box className={styles.usedFacets} type={EBoxType.vertical} position={EBoxPosition.start}>
                                    <div className={styles.title}>Facettes utilisées</div>
                                    {this.displayCurrentFacets()}
                                </Box>
                            </Toast>
                        }
                    </Fragment>
                }
            </Box>
        )
    }

    protected buildFacets = (event: React.SyntheticEvent | null = null) => {
        if (!this.filteredDatas.length) {
            return
        }
        const currentTarget = event && event.currentTarget as HTMLInputElement
        const currentFacetValue = currentTarget && currentTarget.getAttribute('data-facet-value')
        const facets: any = []
        const usedFacets = this.getUsedFacets()
        const isCurrentTargetChecked = currentTarget && currentTarget.checked
        const currentTargetValue = currentTarget && Number(currentTarget.value)
        const isSearchValue = this.refInput.current && this.refInput.current.value !== ''
        this.props.facets.forEach((facet: any) => {
            // Aggreagation FILTER
            const isInBetweenFacet = facet.type === 'inBetween'
            const initialInBetweenFacetTargetValue = this.initialInBetweenFacetTargetValue[facet.value]
            if (currentFacetValue) {
                if (currentFacetValue !== facet.value) {
                    this.facetsDatas[facet.value] = isInBetweenFacet || isCurrentTargetChecked || this.filter.length > 1 && !usedFacets.includes(facet.value) || !isCurrentTargetChecked && (this.filter.length === 1 && !this.filter.some((filter) => filter.hasOwnProperty(facet.value)) || usedFacets.length > 1) || isSearchValue ? this.filteredDatas : this.datas
                }
                if (currentFacetValue === facet.value && (isInBetweenFacet && currentTargetValue || !isInBetweenFacet)) {
                    this.facetsDatas[facet.value] = initialInBetweenFacetTargetValue && (currentTargetValue && (currentTargetValue > initialInBetweenFacetTargetValue.min || currentTargetValue < initialInBetweenFacetTargetValue.max)) || usedFacets.length > 1 && isCurrentTargetChecked || !isCurrentTargetChecked && (!usedFacets.includes(facet.value) || usedFacets.length > 1) || isSearchValue ? this.filteredDatas : this.datas
                }
            } else if (isSearchValue) {
                this.facetsDatas[facet.value] = this.filteredDatas
            } else if (!this.filter.length) {
                this.facetsDatas[facet.value] = this.datas
            }
            const datas = this.facetsDatas[facet.value] || this.datas
            const values: { [key: string]: number } = {}
            // Aggrégation NUMBER
            datas.forEach((data: any) => {
                const addValue = (value: string) => values[value] = values[value] ? values[value] + 1 : 1
                const exisitingValue = Object.keys(values).find((value) => typeof data[facet.value] === 'string' ? data[facet.value].includes(value) : data[facet.value] === value)
                // Si la valeur est incluse dans une valeure existante on l'ajoute au décompte sinon on enregistre la première valeur si elle existe
                if (exisitingValue || data[facet.value]) {
                    addValue(exisitingValue || data[facet.value])
                }
            })
            switch (facet.type) {
                case EFacetsType.checkbox:
                    facets.push(
                        <fieldset className={styles.facet + ' ' + facet.value} key={Utils.generateId()}>
                            <legend>{facet.name}</legend>
                            {
                                Object.entries(values).map((value: any) => {
                                    return (
                                        <Box type={EBoxType.horizontal} key={Utils.generateId()} position={EBoxPosition.start} className={styles.checkbox}>
                                            <Field customProps={{ 'data-facet-value': facet.value, 'defaultChecked': this.filter.some((val: any) => val[facet.value] === value[0]) }} type={EFieldType.checkbox} label={value[0]} name={value[0]} value={value[0]} onChange={(e: React.SyntheticEvent) => {
                                                const checkbox: any = {}
                                                checkbox[facet.value] = value[0]
                                                const index = this.filter.findIndex((val: any) => val[facet.value] === value[0])
                                                if (index !== -1) {
                                                    this.filter.splice(index, 1)
                                                } else {
                                                    this.filter.push(checkbox)
                                                }
                                                this.onChange(e)
                                            }} />
                                            <span className={styles.aggCount}>{value[1]}</span>
                                        </Box>
                                    )
                                })
                            }
                        </fieldset >
                    )
                    break
                case EFacetsType.inBetween:
                    // TODO si plus d'un certain nombre afficher un +
                    const numberValue = Object.keys(values).filter((value) => !isNaN(Number(value))).map(Number)
                    const min = Math.min(...numberValue)
                    const max = Math.max(...numberValue)
                    if (!this.initialInBetweenFacetTargetValue[facet.value]) {
                        this.initialInBetweenFacetTargetValue[facet.value] = { min, max }
                    }
                    facets.push(
                        <fieldset className={styles.facet + ' ' + facet.value} key={Utils.generateId()}>
                            <legend>{facet.name}</legend>
                            <div className={styles.inBetweenFacet}>
                                <div className={styles.inBetweenPart}>
                                    <div className={styles.inBetweenContainer}>
                                        <div className={styles.inBetweenInput}>
                                            <input id={facet.value + '_min'} step='1' name={facet.value + '-first'} type='number' max={String(max)} min={String(min)} defaultValue={currentTarget && currentTarget.id.includes('min') && currentFacetValue === facet.value ? currentTarget.value : String(min)} data-facet-value={facet.value} onKeyUp={(e: React.KeyboardEvent) => {
                                                if (e.key === 'Enter') {
                                                    this.inBetweenChange(e, facet)
                                                }
                                            }} />
                                        </div>
                                        <div className={styles.unit}>{facet.unit}</div>
                                    </div>
                                </div>
                                <span className={styles.divider}>à</span>
                                <div className={styles.inBetweenPart}>
                                    <div className={styles.inBetweenContainer}>
                                        <div className={styles.inBetweenInput}>
                                            <input id={facet.value + '_max'} step='1' name={facet.value + '-last'} type='number' max={String(max)} min={String(min)} defaultValue={currentTarget && currentTarget.id.includes('max') && currentFacetValue === facet.value ? currentTarget.value : String(max)} data-facet-value={facet.value} onKeyUp={(e: React.KeyboardEvent) => {
                                                if (e.key === 'Enter') {
                                                    this.inBetweenChange(e, facet)
                                                }
                                            }} />
                                        </div>
                                        <div className={styles.unit}>{facet.unit}</div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    )
                    break
            }
        })
        this.setState({ facets })
    }

    protected inBetweenChange = (e: React.SyntheticEvent, facet: any) => {
        const input = (e.target as HTMLInputElement)
        const minValue = input.id.includes('min') ? input.value : (document.querySelector('#' + facet.value + '_min') as HTMLInputElement).value
        const maxValue = input.id.includes('max') ? input.value : (document.querySelector('#' + facet.value + '_max') as HTMLInputElement).value
        const inBetween: any = {}
        inBetween[facet.value] = { min: Number(minValue), max: Number(maxValue) }
        const index = this.filter.findIndex((value: any) => value[facet.value])
        if (index !== -1) {
            this.filter.splice(index, 1)
        }
        if (minValue > this.initialInBetweenFacetTargetValue[facet.value].min || maxValue < this.initialInBetweenFacetTargetValue[facet.value].max) {
            this.filter.push(inBetween)
        }
        this.onChange(e)
    }

    protected onChange = (e: React.SyntheticEvent | null = null) => {
        if (this.refInput.current) {
            const currentValue = this.refInput.current.value
            this.setState({ isResetButtonVisible: this.refInput.current.value !== '' })
            const filterResults: any = []
            const searchResults: any = []
            if (currentValue !== '' || this.filter.length) {
                let requestResults: any = {}
                // Sort by key
                if (this.sortKey !== this.props.sortKey || this.sortKeyOrder !== this.props.sortKeyOrder) {
                    this.sortKey = this.props.sortKey
                    this.sortKeyOrder = this.props.sortKeyOrder
                    Utils.sortObjectsArrayByKey(this.datas, this.props.sortKey, this.props.sortKeyOrder || ESearchKeyOrder.asc)
                }
                // Searching request
                if (currentValue !== '') {
                    this.datas.forEach((child: any) => {
                        this.props.fields.forEach((field) => {
                            if (currentValue !== '' && String(child[field]).toLowerCase().includes(currentValue.toLowerCase()) && child.key) {
                                requestResults[child.key] = { ...child }
                            }
                        })
                    })
                }
                // Filter request
                if (this.filter.length) {
                    const filtersCounter: any = []
                    this.datas.forEach((child: any) => {
                        // Si la valeur est déjà dans la requete si une recherche est en cours ou s'il n'y a pas de recherche
                        if (currentValue !== '' && requestResults[child.key] || currentValue === '') {
                            this.filter.forEach((filter) => {
                                // Pour chaque data, pour chaque filtre on stock la donnée dans un tableau non dédoublonné
                                const facetType = Object.keys(filter)[0]
                                const facetValue = Object.values(filter)[0]
                                const isInBetweenFilter = typeof facetValue === 'object' && child[facetType] <= (facetValue as any).max && child[facetType] >= (facetValue as any).min
                                const isCheckboxFilter = typeof facetValue !== 'object' && String(child[facetType]).toLowerCase().includes(facetValue.toLowerCase())
                                if (isCheckboxFilter || isInBetweenFilter) {
                                    filtersCounter.push(child)
                                }
                            })
                        }
                    })
                    // requestResult Walker
                    requestResults = filtersCounter
                        // transforme en object {el, count} pour permettre le décompte du nombre d'éléments et son dédoublonnage
                        .reduce((acc: any, item: any) => ((acc[acc.findIndex((d: any) => d.el === item)] || acc[acc.push({ el: item, count: 0 }) - 1]).count++ , acc), [])
                        // si le nombre d'élément est égale au nombre de filtres différents on récupère les éléments sous forme {el, count}
                        .filter((item: any) => item.count === this.getUsedFacets().length)
                        // on recrée l'objet en data à partir du tableau de form arr[{el, count}]
                        .reduce((acc: any, item: any) => (acc[item.el.key] = item.el, acc), {})
                    // Adapte this.filter aux résultats pour ne garder que les filter en cours d'execution s'il existe des résultats
                    if (Object.keys(requestResults).length) {
                        this.filter = this.filter.filter((filter) => {
                            let returnFilter = false
                            // tslint:disable-next-line:forin
                            for (const key in requestResults) {
                                const facet = Object.keys(filter)[0]
                                const value = Object.values(filter)[0]
                                if (requestResults[key][facet] === value || requestResults[key][facet] === Number(value) || requestResults[key][facet] <= (value as any).max && requestResults[key][facet] >= (value as any).min) {
                                    returnFilter = true
                                    break
                                }
                            }
                            return returnFilter
                        })
                    }
                }
                // Création des tableaux de résultats recherche et facettes
                this.datas.forEach((data: any) => {
                    if (requestResults[data.key]) {
                        // Nécessaire pour que les résultats soient dans l'ordre des datas défini dans sortByKey
                        filterResults.push(requestResults[data.key])
                        // Hihglight term dans un autre tableau pour ne pas garder les caractères de recherche dans les facettes
                        if (currentValue !== '') {
                            const highlightData: any = {}
                            for (const key in data) {
                                if (data.hasOwnProperty(key) && typeof data[key] !== 'object' && this.props.fields.includes(key)) {
                                    highlightData[key] = String(data[key]).replace(new RegExp('(' + currentValue + ')', 'gi'), '~s§s§$1~s')
                                } else {
                                    highlightData[key] = data[key]
                                }
                            }
                            searchResults.push(highlightData)
                        }
                    }
                })
            }
            this.filteredDatas = filterResults.length || currentValue !== '' || this.filter.length ? filterResults : this.datas
            this.buildFacets(e)
            this.props.onChange(searchResults.length ? searchResults : filterResults.length || currentValue !== '' || this.filter.length ? filterResults : this.datas)
        }
    }

    protected resetFullText = () => {
        if (this.refInput.current) {
            this.refInput.current.value = ''
            this.onChange()
        }
        this.setState({ isResetButtonVisible: false })
    }

    protected resetFilter = () => {
        this.filter = []
        this.facetsDatas = {}
        this.onChange()
    }

    protected getUsedFacets = () => Object.keys(this.filter.reduce((acc: any, filter: any) => (acc[Object.keys(filter)[0]] = true, acc), {}))

    protected displayCurrentFacets() {
        const usedFacets = this.props.facets.map((facet: any) => {
            if (this.getUsedFacets().includes(facet.value)) {
                return (
                    <Box className={styles.facetType} key={Utils.generateId()} type={EBoxType.horizontal} position={EBoxPosition.start}>
                        <Box type={EBoxType.horizontal} position={EBoxPosition.start} className={styles.title}>{facet.name}</Box>
                        <div className={styles.content}>
                            {
                                this.filter.map((filter: any) => {
                                    if (filter[facet.value]) {
                                        switch (facet.type) {
                                            case EFacetsType.checkbox:
                                                return <span key={Utils.generateId()}>{filter[facet.value]}</span>
                                            case EFacetsType.inBetween:
                                                return (
                                                    <div key={Utils.generateId()}>
                                                        <span>Entre </span>
                                                        <span>{filter[facet.value].min}</span>
                                                        <span> et </span>
                                                        <span>{filter[facet.value].max}</span>
                                                        <span> {facet.unit}</span>
                                                    </div>
                                                )
                                        }
                                    }
                                })
                            }
                        </div>
                    </Box>
                )
            }
        })
        return usedFacets
    }
}
