import { Fragment } from 'react'
import React from 'reactn'
import Utils from '../../../tools/utils'

export interface IListProps {
    children: any[]
    component: any
}

class List extends React.Component<IListProps> {
    public render() {
        const { children, component } = this.props
        return (
            <Fragment>
                {/* <Sort /> */}
                {children.map((datas: any) => Utils.createComponent(component, datas))}
            </Fragment>
        )
    }
}

export default List
