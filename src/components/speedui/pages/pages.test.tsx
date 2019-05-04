import React from 'react'
import ReactDOM from 'react-dom'
import Pages from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Pages />, div)
    ReactDOM.unmountComponentAtNode(div)
})
