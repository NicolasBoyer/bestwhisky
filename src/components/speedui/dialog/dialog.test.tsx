import React from 'react'
import ReactDOM from 'react-dom'
import Dialog, { IDialogProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IDialogProps = {
        ariaLabel: 'This is a form dialog',
        onClose: () => {
            //
        },
        open: true,
        title: ''
    }
    ReactDOM.render(<Dialog {...props}><input /></Dialog>, div)
    ReactDOM.unmountComponentAtNode(div)
})
