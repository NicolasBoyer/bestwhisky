import React from 'react'
import ReactDOM from 'react-dom'
import Popup, { IPopupProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IPopupProps = {
        left: 0,
        onClose: () => {
            //
        },
        open: true,
        top: 0
    }
    ReactDOM.render(<Popup {...props}><input /></Popup>, div)
    ReactDOM.unmountComponentAtNode(div)
})
