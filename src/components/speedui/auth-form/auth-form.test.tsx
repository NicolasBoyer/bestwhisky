import React from 'react'
import ReactDOM from 'react-dom'
import AuthForm, { EAuthType, IAuthFormProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IAuthFormProps = {
        type: EAuthType.signin
    }
    ReactDOM.render(<AuthForm {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
