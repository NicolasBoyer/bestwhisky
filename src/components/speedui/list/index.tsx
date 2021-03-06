import React, { Fragment } from 'react'
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
                {children.map((datas: any) => {
                    datas.id = datas.key
                    return Utils.createComponent(component, datas)
                })}
            </Fragment>
        )
    }
}

export default List
