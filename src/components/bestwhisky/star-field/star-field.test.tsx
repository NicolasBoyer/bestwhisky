import React from 'react'
import ReactDOM from 'react-dom'
import StarField from '.'
// import StarField, { IStarFieldProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    // const props: IStarFieldProps = {

    // }
    // ReactDOM.render(<StarField {...props} />, div)
    ReactDOM.render(<StarField />, div)
    ReactDOM.unmountComponentAtNode(div)
})
