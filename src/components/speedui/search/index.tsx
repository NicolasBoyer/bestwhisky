import React, { createRef } from 'react'
import Utils from '../../../tools/utils'
import Box, { EBoxPosition, EBoxType } from '../box'
import Button from '../button'
import Icon from '../icon'
import PopupButton from '../popup-button'
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
    isActive: boolean
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
    protected initialDatas: any
    protected initialInBetweenFacetTargetValue: any = {}
    protected sortKey: any
    protected sortKeyOrder: any

    constructor(props: ISearchProps) {
        super(props)
        this.state = { isResetButtonVisible: false, isActive: false, isFacetsOpen: false, facetsLeft: 0, facetsTop: 0, facets: [] }
    }

    public componentDidMount = () => document.body.addEventListener('databaseReady', () => this.buildFacets())

    public render() {
        return (
            <Box type={EBoxType.horizontal} position={EBoxPosition.end} className={styles.searchBox}>
                <form className={styles.form} role='search' onSubmit={(e) => e.preventDefault()}>
                    <input type='search' placeholder={this.props.placeHolder} onChange={this.onChange} autoComplete='off' autoCorrect='off' autoCapitalize='off' ref={this.refInput} required />
                    <Icon name='search' className={styles.searchIcon} />
                    <Button className={styles.reset + (this.state.isResetButtonVisible ? ' ' + styles.isVisible : '')} iconName='cross' label='Reset' handleClick={this.reset} />
                </form>
                {this.props.facetsAlwaysVisible &&
                    <Box type={EBoxType.vertical}>
                        {this.state.facets}
                    </Box>
                }
                {this.props.facets && !this.props.facetsAlwaysVisible &&
                    <PopupButton allowScroll={true} className={styles.facetsButton} label='Facettes' iconName='sliders' onBeforeOpen={this.buildFacets}>
                        {this.state.facets}
                    </PopupButton>
                }
            </Box>
        )
    }

    protected buildFacets = (event: React.SyntheticEvent | null = null) => {
        console.log(this.filter)
        console.log(this.props.facets)
        const currentTarget = event && event.currentTarget as HTMLInputElement
        const currentFacetValue = currentTarget && currentTarget.getAttribute('data-facet-value')
        const facets: any = []
        const usedFacets = Object.keys(this.filter.reduce((acc: any, filter: any) => (acc[Object.keys(filter)[0]] = true, acc), {}))
        const isCurrentTargetChecked = currentTarget && currentTarget.checked
        const currentTargetValue = currentTarget && Number(currentTarget.value)
        this.props.facets.forEach((facet: any) => {
            // Aggreagation FILTER
            //  TODO filtre pas au clic + affichage filtre en cours
            const isInBetweenFacet = facet.type === 'inBetween'
            const initialInBetweenFacetTargetValue = this.initialInBetweenFacetTargetValue[facet.value]
            if (currentFacetValue && currentFacetValue !== facet.value) {
                this.facetsDatas[facet.value] = isInBetweenFacet || isCurrentTargetChecked || this.filter.length > 1 && !usedFacets.includes(facet.value) || !isCurrentTargetChecked && (this.filter.length === 1 && !this.filter.some((filter) => filter.hasOwnProperty(facet.value)) || usedFacets.length > 1) ? this.filteredDatas : this.datas
            }
            if (currentFacetValue && currentFacetValue === facet.value && currentTargetValue) {
                this.facetsDatas[facet.value] = initialInBetweenFacetTargetValue && (currentTargetValue > initialInBetweenFacetTargetValue.min || currentTargetValue < initialInBetweenFacetTargetValue.max) || usedFacets.length > 1 && isCurrentTargetChecked || !isCurrentTargetChecked && (!usedFacets.includes(facet.value) || usedFacets.length > 1) ? this.filteredDatas : this.datas
            }
            const datas = this.facetsDatas[facet.value] || this.datas
            const values: { [key: string]: number } = {}
            datas.forEach((data: any) => {
                const addValue = (value: string) => values[value] = values[value] ? values[value] + 1 : 1
                const exisitingValue = Object.keys(values).find((value) => typeof data[facet.value] === 'string' ? data[facet.value].includes(value) : data[facet.value] === value)
                // Si la valeur est incluse dans une valeure existante on l'ajoute au décompte
                if (exisitingValue) {
                    addValue(exisitingValue)
                }
                // On ajoute toujours la valeur courante
                addValue(data[facet.value])
            })
            switch (facet.type) {
                case EFacetsType.checkbox:
                    facets.push(
                        <fieldset className={styles.facet + ' ' + facet.value} key={Utils.generateId()}>
                            <legend>{facet.name}</legend>
                            {
                                Object.entries(values).map((value: any) => {
                                    return (
                                        // TODO : A passer en checkbox dans field + aussi pour sort ?
                                        <label key={Utils.generateId()}>
                                            <input type='checkbox' data-facet-value={facet.value} value={value[0]} defaultChecked={this.filter.some((val: any) => val[facet.value] === value[0])} onChange={(e: React.SyntheticEvent) => {
                                                // TODO Faire pays + régions au lieu d'origine ou appeler le filtre Origine IMPORTANT !! A changer dans home whisky et whisky details mais ensuite à commiter car faudra changer la BDD
                                                // if (this.filter.includes(value[0])) {
                                                //     this.filter.splice(this.filter.indexOf(value[0]), 1)
                                                // } else {
                                                //     this.filter.push(value[0])
                                                // }
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
                                            <span>{value[0]}</span>
                                            <span className={styles.aggCount}>{value[1]}</span>
                                        </label>
                                    )
                                })
                            }
                        </fieldset>
                    )
                    break
                case EFacetsType.inBetween:
                    // TODO bug notation ajout tourbé / pas tourbé + facet notation
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
                                            {/* onBlur={(e: React.SyntheticEvent) => this.inBetweenChange(e, facet)} delete */}
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

    protected onChange = (e: React.SyntheticEvent) => {
        if (this.refInput.current) {
            const currentValue = this.refInput.current.value
            if (!this.state.isActive && (currentValue.length === 1 || this.filter.length === 1)) {
                // Permet de remettre les données comme envoyées avant le sort si pas de changement de sort pendant la recherche grace a isActive
                this.initialDatas = Array.from(this.props.datas)
            }
            this.setState({ isResetButtonVisible: this.refInput.current.value !== '' })
            const results: any = []
            if (currentValue !== '' || this.filter.length) {
                let requestResults: any = {}
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
                        .filter((item: any) => item.count === Object.keys(this.filter.reduce((acc: any, filter: any) => (acc[Object.keys(filter)[0]] = true, acc), {})).length)
                        // on recrée l'objet en data à partir du tableau de form arr[{el, count}]
                        .reduce((acc: any, item: any) => (acc[item.el.key] = item.el, acc), {})
                    // Adapte this.filter aux résultats pour ne garder que les filter en cours d'execution
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
                // Hihglight term
                this.datas.forEach((data: any) => {
                    if (requestResults[data.key]) {
                        if (currentValue !== '') {
                            this.props.fields.forEach((field) => {
                                requestResults[data.key][field] = data[field].replace(new RegExp('(' + currentValue + ')', 'gi'), '~s§s§$1~s')
                            })
                        }
                        // Nécessaire pour que les résultats soient dans l'ordre des datas défini dans sortByKey
                        results.push(requestResults[data.key])
                    }
                })
            }
            this.setState({ isActive: currentValue.length > 0 || this.filter.length > 0 })
            this.filteredDatas = results.length || currentValue !== '' || this.filter.length ? results : this.initialDatas
            this.buildFacets(e)
            this.props.onChange(this.filteredDatas)
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
