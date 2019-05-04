import React from 'react'
import ReactDOM from 'react-dom'
import List, { IListProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IListProps = {
        children: [],
        component: null
    }
    ReactDOM.render(<List {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
