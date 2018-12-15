import React from 'react'
import ReactDOM from 'react-dom'
import Form, { IFormProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IFormProps = {
        inputs: [],
        onChange: () => {
            //
        },
        onSubmit: () => {
            //
        }
    }
    ReactDOM.render(<Form {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
