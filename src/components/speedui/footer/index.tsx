import React from 'react'
import Box, { EBoxPosition, EBoxType } from '../box'
import styles from './footer.module.css'

export interface IFooterProps {
    credit?: string
    createdBy?: string
}

export default class Footer extends React.Component<IFooterProps> {
    public render() {
        const { children, credit, createdBy } = this.props
        return (
            <footer className={styles.footer}>
                <Box className={styles.infos} type={EBoxType.vertical}>
                    <Box className={styles.legal} position={EBoxPosition.spaceAround} type={EBoxType.horizontal}>
                        {children}
                        {credit && <div>© <span className={styles.emphase}>{credit}</span>. Tous droits réservés.</div>}
                        {createdBy && <div>Réalisé par <span className={styles.emphase}>{createdBy}</span> avec Speedui.</div>}
                    </Box>
                </Box>
            </footer>
        )
    }
}
