import React from 'react'
import ReactDOM from 'react-dom'
import SignUp from '.'
import { IAuthProps } from '../auth'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IAuthProps = {
        firebase: null
    }
    ReactDOM.render(<SignUp {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
