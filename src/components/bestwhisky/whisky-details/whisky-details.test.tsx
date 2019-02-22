import React from 'react'
import ReactDOM from 'react-dom'
import WhiskyDetails from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<WhiskyDetails location={{ state: { views: [] } }} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
