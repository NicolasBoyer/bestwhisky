import React from 'react'
import ReactDOM from 'react-dom'
import Home, { IHomeProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IHomeProps = {
        // globalState: '',
        path: ''
    }
    ReactDOM.render(<Home {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
