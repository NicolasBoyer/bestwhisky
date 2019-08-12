import { Image } from 'cloudinary-react'
import { Fragment } from 'react'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import { ERoutes } from '../../../tools/routes'
import Utils from '../../../tools/utils'
import AlertDialog, { EDialogAlertType } from '../../speedui/alert-dialog'
import Box, { EBoxType } from '../../speedui/box'
import Card from '../../speedui/card'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import { addWhiskyInputs } from '../home'
import Note from '../note'
import styles from './whisky.module.css'

export interface IWhiskyProps {
    createdBy: string
    // comments?: []
    id: string
    key: string
    name: string
    description: any
    price: number
    country: string
    district?: string
    peat?: boolean
    size?: number
    image?: string
    views: Array<{ author: string, stars: number }>
}

interface IWhiskyState {
    isAlertOpen: boolean
}

export default class Whisky extends React.Component<IWhiskyProps, IWhiskyState> {
    constructor(props: IWhiskyProps) {
        super(props)
        this.state = { isAlertOpen: false }
    }

    public render() {
        const { id, country, createdBy, name, views, description, district, image, price, peat, size } = this.props
        const usersNote = views.reduce((sum, view) => sum + view.stars, 0) / views.length
        const userView = views.find((view) => this.global.user && this.global.user.displayName === view.author)
        const note = userView && userView.stars
        // TODO : bug on reco
        const editButton = <FormDialog datas={{ usersNote, note, ...this.props }} inputs={addWhiskyInputs} title='Editer un Whisky' mode={EFormDialogMode.edit} />
        return (
            <Fragment>
                <AlertDialog message='Etes vous sur de vouloir supprimer ?' open={this.state.isAlertOpen} title='Attention !' accept={this.remove} type={EDialogAlertType.confirm} onClose={this.alertClose} />
                <Card name={Utils.displaySearchTerm(name)} click={ERoutes.whisky + Utils.slugify(name)} historyState={{ usersNote, note, ...this.props }} editButton={editButton} remove={this.alertOpen} isAuth={this.global.user && this.global.user.displayName === createdBy}>
                    <Box type={EBoxType.aroundFirstLeft}>
                        {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='180' crop='scale' />}
                        <div className={styles.metas}>
                            <span>{Utils.displaySearchTerm(country)} {district && (' / ' + Utils.displaySearchTerm(district))}</span>
                            {size && <span>, </span>}
                            {size && <span>{size}cl</span>}
                        </div>
                        <div className={styles.price}>Prix : {price} €</div>
                        <div>Tourbé : {peat ? 'Oui' : 'Non'}</div>
                        <Note className={styles.note} views={views} readonly={true} />
                        {description && <div className={styles.description}>{Utils.toParagraph(description, 200)}</div>}
                    </Box>
                </Card>
            </Fragment>
        )
    }

    protected remove = () => {
        this.setState({ isAlertOpen: false })
        this.global.firebase.remove('whiskies', this.props.id)
        this.global.firebase.remove('views', this.props.id)
    }

    protected alertOpen = () => this.setState({ isAlertOpen: true })

    protected alertClose = () => this.setState({ isAlertOpen: false })
}
