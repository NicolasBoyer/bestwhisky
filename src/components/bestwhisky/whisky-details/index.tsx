import { Image } from 'cloudinary-react'
import { createRef, Fragment } from 'react'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import AlertDialog, { EDialogAlertType } from '../../speedui/alert-dialog'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import Score from '../../speedui/score'
import { EToastType } from '../../speedui/toast'
import { addWhiskyInputs } from '../home'
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
    description: any
    image: string
    price: number
    origin: string
    size: number
    views: Array<{ author: string, stars: number }>
}

export default class WhiskyDetails extends React.Component<IWhiskyDetailsProps, IWhiskyDetailsState> {
    protected refScore: React.RefObject<Score> = createRef()

    constructor(props: IWhiskyDetailsProps) {
        super(props)
        console.log(this.props.location)
        this.state = { ...this.props.location.state }
        // TODO : changer la taille de la section et suppr header sur cette page sans doute aussi sur auth + onchange + edit et delete + gestion erreur console retour + retour footer ...
    }

    public render() {
        const { createdBy, name, description, image, price, origin, size, views } = this.state
        return (
            <Fragment>
                <FormDialog datas={{ ...this.state }} inputs={addWhiskyInputs} title='Editer un Whisky' mode={EFormDialogMode.edit} />
                {/* <AlertDialog message='Etes vous sur de vouloir supprimer ?' open={this.state.isAlertOpen} title='Attention !' accept={this.remove} type={EDialogAlertType.confirm} onClose={this.close} /> */}
                <h2 className={styles.title}>
                    <span>{name}</span>
                </h2>
                <Box type={EBoxType.horizontal} position={EBoxPosition.spaceBetween}>
                    <div>
                        {(origin || size) &&
                            <div className={styles.metas}>
                                {origin && <span>{origin}</span>}
                                {(origin && size) && <span>, </span>}
                                {size && <span>{size}cl</span>}
                            </div>
                        }
                        {price && <div className={styles.price}>Prix : {price} €</div>}
                    </div>
                    <Box type={EBoxType.horizontal} position={EBoxPosition.spaceBetween}>
                        <Score maxScore={5} onChange={this.onChange} ref={this.refScore} />
                        <span className={styles.views}>{views.length + ' avis'}</span>
                    </Box>
                </Box>
                <Box className={styles.content} type={EBoxType.aroundFirstLeft}>
                    {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='300' crop='scale' />}
                    {description && <div className={styles.description}>{Utils.toParagraph(description)}</div>}
                </Box>
                {createdBy && <div className={styles.createdBy}>Créé par : {createdBy}</div>}
            </Fragment>
        )
    }

    public componentDidMount() {
        if (this.refScore.current) {
            this.refScore.current.setValue(this.state.note)
        }
    }

    protected onChange = () => {
        // TODO : rgpd
        // TODO : bouton mask + alert
        // Todo : Finir l'édition car aujourd'hui n'enregistre pas
        const user = this.global.user.displayName
        const id = this.state.id
        const data = { createdBy: user, key: id, note: this.refScore.current && this.refScore.current.getValue() }
        this.global.firebase.update('views/' + id + '/' + user, data).then(() => {
            const views = this.state.views as any
            views.find((view: any) => view.author === user).stars = this.refScore.current && this.refScore.current.getValue()
            const note = views.reduce((sum: any, view: any) => sum + Number(view.stars), 0) / views.length
            this.setState({ note })
            // TODO : voir comment améliorer l'utilisation de cet historique
            window.history.replaceState(this.state, '')
            if (this.refScore.current) {
                this.refScore.current.setValue(note)
            }
            // this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'L\'édition a bien été effectué.', toastType: EToastType.success, toastAutoHideDuration: 3 } })
        }).catch((error: any) => {
            this.setGlobal({ toast: { isToastOpen: true, toastMessage: 'Erreur : ' + error.message, toastType: EToastType.error, isToastCloseButton: true } })
            console.error(error)
        })
    }

    // protected showWhisky = (e: React.SyntheticEvent) => {
    //     console.log(Utils.slugify(this.props.name))
    // }

    // protected remove = () => {
    //     this.setState({ isAlertOpen: false })
    //     this.global.firebase.remove('whiskies', this.props.id)
    //     this.global.firebase.remove('views', this.props.id)
    // }

    // protected close = () => this.setState({ isAlertOpen: false })
}
