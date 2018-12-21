import { Image } from 'cloudinary-react'
import React from 'react'
import Utils from '../../../tools/utils'
import Card from '../../speedui/card'
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

// export interface IAppState {
// }

export default class Whisky extends React.Component<IWhiskyProps> {
    // constructor(props: IWhiskyProps) {
    //     super(props)
    //     // this.state = {
    //     // }
    // }

    public render() {
        const { name, views, description, image, price, origin, size } = this.props
        return (
            <Card name={name} loadMoreButton={true} clickAction={this.showWhisky}>
                {image && <Image cloudName='demo' publicId={image} width='180' crop='scale' />}
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
        )
    }

    protected showWhisky = (e: React.SyntheticEvent) => {
        console.log(Utils.slugify(this.props.name))
    }
}
