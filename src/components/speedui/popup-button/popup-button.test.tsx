import React from 'react'
import ReactDOM from 'react-dom'
import PopupButton, { IPopupButtonProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IPopupButtonProps = {
        label: ''
    }
    ReactDOM.render(<PopupButton {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
