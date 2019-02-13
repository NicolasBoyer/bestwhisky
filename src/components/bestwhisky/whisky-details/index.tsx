import { Image } from 'cloudinary-react'
import { Fragment } from 'react'
import React from 'reactn'
import { cloudinary } from '../../../tools/config'
import Utils from '../../../tools/utils'
import AlertDialog, { EDialogAlertType } from '../../speedui/alert-dialog'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import Card from '../../speedui/card'
import FormDialog, { EFormDialogMode } from '../../speedui/form-dialog'
import { addWhiskyInputs } from '../home'
import Stars from '../stars'
import styles from './whisky-details.module.css'

// export interface IWhiskyProps {
//     createdBy: string
//     // comments?: []
//     id: string
//     key: string
//     name: string
//     description: any
//     price?: number
//     origin?: string
//     size?: number
//     image?: string
//     views: Array<{ author: string, stars: number, view?: string }>
// }
export interface IWhiskyDetailsProps {
    location?: any
    path?: string
}

// interface IWhiskyState {
//     isAlertOpen: boolean
// }

export default class WhiskyDetails extends React.Component<IWhiskyDetailsProps> {
    // constructor(props: IWhiskyDetailsProps) {
    //     super(props)
    //     this.state = { datas: [] }
    //     this.datas = this.state.datas
    //     if (this.global.firebase) {
    //         this.global.firebase.read('whiskies', (datas: firebase.database.DataSnapshot, returnType: string) => {
    //             const data = datas.val()
    //             data.views = []
    //             const eltIndex = this.datas.findIndex((obj: any) => obj.key === datas.key)
    //             if (returnType === 'added') {
    //                 this.datas.push(data)
    //             }
    //             if (returnType === 'changed') {
    //                 this.datas[eltIndex] = data
    //             }
    //             if (returnType === 'removed') {
    //                 this.datas.splice(eltIndex, 1)
    //             }
    //             this.setState({ datas: this.datas })
    //         })
    //         this.global.firebase.read('views', (datas: firebase.database.DataSnapshot, returnType: string) => {
    //             const data = datas.val()
    //             const eltIndex = this.datas.findIndex((obj: any) => obj.key === datas.key)
    //             if (returnType === 'added' || returnType === 'changed') {
    //                 this.datas[eltIndex].views = []
    //                 for (const key in data) {
    //                     if (data.hasOwnProperty(key)) {
    //                         const view: any = {}
    //                         view.author = key
    //                         view.stars = data[key].note
    //                         this.datas[eltIndex].views.push(view)
    //                     }
    //                 }
    //             }
    //             this.setState({ datas: this.datas })
    //         })
    //     }
    // }

    public render() {
        // const { createdBy, name, views, description, image, price, origin, size } = this.props
        // const note = this.props.views.reduce((sum, view) => sum + Number(view.stars), 0) / this.props.views.length
        // TODO : bug on reco
        // const editButton = <FormDialog datas={{ note, ...this.props }} inputs={addWhiskyInputs} title='Editer un Whisky' mode={EFormDialogMode.edit} />
        return (
            <Fragment>
                <h2>
                    <span>Name</span>
                </h2>
                <Box type={EBoxType.horizontal} position={EBoxPosition.spaceBetween}>
                    <div>
                        <div>Irlande</div>
                        <div>Prix : 50</div>
                    </div>
                    <div>Score</div>
                </Box>
                <div>
                    {/* {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='180' crop='scale' />} */}
                    <div>
                        Détail - {this.props.location.state.id}
                    </div>
                </div>
            </Fragment>
            // <Fragment>
            //     <AlertDialog message='Etes vous sur de vouloir supprimer ?' open={this.state.isAlertOpen} title='Attention !' accept={this.remove} type={EDialogAlertType.confirm} onClose={this.close} />
            //     <Card name={name} click={this.showWhisky} editButton={editButton} remove={() => this.setState({ isAlertOpen: true })} isAuth={this.global.user && this.global.user.displayName === createdBy}>
            //         {image && <Image cloudName={cloudinary.cloudName} publicId={image} width='180' crop='scale' />}
            //         <div className={styles.infos}>
            //             {(origin || size) && <div className={styles.metas}>
            //                 {origin && <span>{origin}</span>}
            //                 {(origin && size) && <span>, </span>}
            //                 {size && <span>{size}cl</span>}
            //             </div>}
            //             {price && <div className={styles.price}>Prix : {price} €</div>}
            //             <Stars views={views} />
            //             <div className={styles.description}>{description}</div>
            //         </div>
            //     </Card>
            // </Fragment>
        )
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
