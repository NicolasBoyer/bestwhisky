import { navigate } from '@reach/router'
import { Image } from 'cloudinary-react'
import { Fragment } from 'react'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import AlertDialog, { EDialogAlertType } from '../../speedui/alert-dialog'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import Button from '../../speedui/button'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import { EToastType } from '../../speedui/toast'
import { addWhiskyInputs } from '../home'
import Note from '../note'
import styles from './whisky-details.module.css'

export interface IWhiskyDetailsProps {
    location?: any
    path?: string
}

interface IWhiskyDetailsState {
    id: string
    createdBy: string
    name: string
    note: number
    usersNote: number
    description: any
    image: string
    price: number
    country: string
    district: string
    size: number
    views: Array<{ author: string, stars: number }>
    isAlertOpen: boolean
    peat: boolean
}

export default class WhiskyDetails extends React.Component<IWhiskyDetailsProps, IWhiskyDetailsState> {
    constructor(props: IWhiskyDetailsProps) {
        super(props)
        this.state = { ...this.props.location.state, isAlertOpen: false }
    }

    public render() {
        const { country, createdBy, district, name, description, image, peat, price, size, views } = this.state
        const isAuthor = this.global.user && this.global.user.displayName === createdBy
        const isAthentificated = this.global.user
        return (
            <Fragment>
                {isAuthor && <FormDialog datas={{ ...this.state }} inputs={addWhiskyInputs} title='Editer un Whisky' mode={EFormDialogMode.edit} onClose={this.formDialogClose} />}
                {isAuthor && <Button label='Supprimer' handleClick={this.alertOpen} />}
                <AlertDialog message='Etes vous sur de vouloir supprimer ?' open={this.state.isAlertOpen} title='Attention !' accept={this.remove} type={EDialogAlertType.confirm} onClose={this.alertClose} />
                <h2 className={styles.title}>
                    <span>{Utils.displaySearchTerm(name)}</span>
                </h2>
                <Box type={EBoxType.horizontal} position={EBoxPosition.spaceBetween}>
                    <div>
                        <div className={styles.metas}>
                            <span>{Utils.displaySearchTerm(country)} {district && (' / ' + Utils.displaySearchTerm(district))}</span>
                            {size && <span>, </span>}
                            {size && <span>{size}cl</span>}
                        </div>
                        <div className={styles.price}>Prix : {price} €</div>
                        <div>Tourbé : {peat ? 'Oui' : 'Non'}</div>
                    </div>
                    <Note views={views} onChange={this.onChange} readonly={!isAthentificated} />
                </Box>
                <Box className={styles.content} type={EBoxType.aroundFirstLeft}>
                    {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='300' crop='scale' />}
                    {description && <div className={styles.description}>{Utils.toParagraph(description)}</div>}
                </Box>
                {createdBy && <div className={styles.createdBy}>Créé par : {Utils.displaySearchTerm(createdBy)}</div>}
            </Fragment>
        )
    }

    protected formDialogClose = (e: React.SyntheticEvent, datas?: any) => {
        this.setState(datas)
        if (datas && datas.note) {
            this.onChange(e, datas.note)
        }
    }

    protected alertOpen = () => this.setState({ isAlertOpen: true })

    protected alertClose = () => this.setState({ isAlertOpen: false })

    protected onChange = (e: React.SyntheticEvent, value: number) => {
        // TODO : animation

        const user = this.global.user.displayName
        const id = this.state.id
        const data = { createdBy: user, key: id, note: value }
        this.global.firebase.update('views/' + id + '/' + user, data).then(() => {
            const views = this.state.views as any
            const existingView = views.find((view: any) => view.author === user)
            if (existingView) {
                existingView.stars = value
            } else {
                views.push({ author: user, stars: value })
            }
            const usersNote = views.reduce((sum: any, view: any) => sum + Number(view.stars), 0) / views.length
            this.setState({ note: value, usersNote })
            // TODO : voir comment améliorer l'utilisation de cet historique
            window.history.replaceState(this.state, '')
        }).catch((error: any) => {
            this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToastCloseButton: true } })
            console.error(error)
        })
    }

    protected remove = () => {
        this.setState({ isAlertOpen: false })
        this.global.firebase.remove('whiskies', this.state.id)
        this.global.firebase.remove('views', this.state.id)
        navigate('/')
    }
}
