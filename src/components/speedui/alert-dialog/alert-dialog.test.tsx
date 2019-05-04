import React from 'react'
import ReactDOM from 'react-dom'
import Dialog, { EDialogAlertType, IAlertDialogProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IAlertDialogProps = {
        message: '',
        title: '',
        type: EDialogAlertType.prompt
    }
    ReactDOM.render(<Dialog {...props}><input /></Dialog>, div)
    ReactDOM.unmountComponentAtNode(div)
})
