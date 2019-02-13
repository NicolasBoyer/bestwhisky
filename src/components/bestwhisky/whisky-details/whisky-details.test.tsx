import React from 'react'
import ReactDOM from 'react-dom'
import WhiskyDetails from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<WhiskyDetails />, div)
    ReactDOM.unmountComponentAtNode(div)
})
