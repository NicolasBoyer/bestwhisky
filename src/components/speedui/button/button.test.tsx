import React from 'react'
import ReactDOM from 'react-dom'
import Button, { IButtonProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IButtonProps = {
        handleClick: (e: React.SyntheticEvent) => {
            //
        },
        label: ''
    }
    ReactDOM.render(<Button {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
