import { Image } from 'cloudinary-react'
import { Fragment } from 'react'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import AlertDialog, { EDialogAlertType } from '../../speedui/alert-dialog'
import Card from '../../speedui/card'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import { addWhiskyInputs } from '../home'
import Stars from '../stars'
import styles from './whisky.module.css'

export interface IWhiskyProps {
    createdBy: string
    // comments?: []
    id: string
    key: string
    name: string
    description: any
    price?: number
    origin?: string
    size?: number
    image?: string
    views: Array<{ author: string, stars: number, view?: string }>
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
        const { createdBy, name, views, description, image, price, origin, size } = this.props
        const note = this.props.views.reduce((sum, view) => sum + Number(view.stars), 0) / this.props.views.length
        // TODO : Ajouter des icones sur les boutons ?
        // TODO : Eiter : en mettant le formdialog dur card et en passant les inputs this.props dan un attr
        // TODO : bug on reco
        const editButton = <FormDialog datas={{ note, ...this.props }} inputs={addWhiskyInputs} title='Editer un Whisky' mode={EFormDialogMode.edit} />
        return (
            <Fragment>
                <AlertDialog message='Etes vous sur de vouloir supprimer ?' open={this.state.isAlertOpen} title='Attention !' accept={this.remove} type={EDialogAlertType.confirm} onClose={this.close} />
                <Card name={name} click={this.showWhisky} editButton={editButton} remove={() => this.setState({ isAlertOpen: true })} isAuth={this.global.user && this.global.user.displayName === createdBy}>
                    {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='180' crop='scale' />}
                    <div className={styles.infos}>
                        {(origin || size) && <div className={styles.metas}>
                            {origin && <span>{origin}</span>}
                            {(origin && size) && <span>, </span>}
                            {size && <span>{size}cl</span>}
                        </div>}
                        {price && <div className={styles.price}>Prix : {price} €</div>}
                        <Stars views={views} />
                        <div className={styles.description}>{description}</div>
                    </div>
                </Card>
            </Fragment>
        )
    }

    protected showWhisky = (e: React.SyntheticEvent) => {
        console.log(Utils.slugify(this.props.name))
    }

    protected remove = () => {
        this.setState({ isAlertOpen: false })
        this.global.firebase.remove('whiskies', this.props.id)
        this.global.firebase.remove('views', this.props.id)
    }

    protected close = () => this.setState({ isAlertOpen: false })

    protected edit = () => {
        // TODO : Le formdialog doit etre utiliser ici ou à supprimer
        // TODO probablement sur le survey le edit !!!
        // this.global.firebase.remove('whiskies', this.props.id)
        // this.global.firebase.remove('views', this.props.id)
    }
}
