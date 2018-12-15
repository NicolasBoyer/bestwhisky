import React from 'react'
import ReactDOM from 'react-dom'
import SubHeader from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<SubHeader name='testname' />, div)
    ReactDOM.unmountComponentAtNode(div)
})
