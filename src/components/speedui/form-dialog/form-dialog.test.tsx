import React from 'react'
import ReactDOM from 'react-dom'
import FormDialog, { EMode, IFormDialogProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IFormDialogProps = {
        inputs: [],
        mode: EMode.add,
        onChange: () => {
            //
        },
        onSubmit: () => {
            //
        },
        title: ''
    }
    ReactDOM.render(<FormDialog {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
