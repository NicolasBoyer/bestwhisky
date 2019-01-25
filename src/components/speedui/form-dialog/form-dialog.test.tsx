import React from 'react'
import ReactDOM from 'react-dom'
import FormDialog, { EFormDialogMode, IFormDialogProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IFormDialogProps = {
        inputs: [],
        mode: EFormDialogMode.add,
        title: ''
    }
    ReactDOM.render(<FormDialog {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
