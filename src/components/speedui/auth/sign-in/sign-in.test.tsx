import React from 'react'
import ReactDOM from 'react-dom'
import SignIn from '.'
import { IAuthProps } from '../auth-config'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IAuthProps = {
        firebase: null
    }
    ReactDOM.render(<SignIn {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
