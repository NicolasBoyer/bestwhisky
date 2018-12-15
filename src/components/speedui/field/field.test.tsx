import React from 'react'
import ReactDOM from 'react-dom'
import Field, { EFieldType, IFieldProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IFieldProps = {
        label: '',
        name: '',
        onChange: (e: React.SyntheticEvent) => {
            //
        },
        type: EFieldType.text
    }
    ReactDOM.render(<Field {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
