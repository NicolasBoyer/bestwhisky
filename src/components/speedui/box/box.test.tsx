import React from 'react'
import ReactDOM from 'react-dom'
import Box, { EBoxType } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Box type={EBoxType.vertical} children={''} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
