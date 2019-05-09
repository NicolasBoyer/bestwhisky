import React from 'react'
import Box, { EBoxPosition, EBoxType } from '../../speedui/box'
import Icon from '../../speedui/icon'
import styles from './stars.module.css'

interface IStarsProps {
    views: Array<{ author: string, stars: number, view?: string }>
}

export default class Stars extends React.Component<IStarsProps> {
    public render() {
        const { views } = this.props
        if (!views || !views.length) {
            return null
        }
        const score = views.reduce((sum, view) => sum + Number(view.stars), 0) / views.length
        const stars: JSX.Element[] = []
        let counter = 0
        while (counter < Math.ceil(score)) {
            let star = <Icon key={counter} className={styles.star} name='star-full' />
            const diffScore = Math.ceil(score) - score
            if (diffScore !== 0 && counter === Math.floor(score)) {
                star = <Icon key={counter} className={styles.star} name='star-full'><rect className={styles.mask} x={24 * (1 - diffScore)} y='0' /></Icon>
            }
            stars.push(star)
            counter++
        }
        return (
            <Box className={styles.stars} type={EBoxType.horizontal} position={EBoxPosition.start}>
                <span>{stars}</span>
                <span className={styles.views}>{views.length + ' avis'}</span>
            </Box>
        )
    }
}
