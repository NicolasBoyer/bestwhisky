import React from 'react'
import ReactDOM from 'react-dom'
import Whisky, { IWhiskyProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IWhiskyProps = {
        createdBy: '',
        description: '',
        key: '1',
        name: '',
        views: []
    }
    ReactDOM.render(<Whisky {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
