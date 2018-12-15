import React from 'react'
import ReactDOM from 'react-dom'
import Toast, { EToastType, IToastProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IToastProps = {
        open: true,
        type: EToastType.success
    }
    ReactDOM.render(<Toast {...props}>Succès</Toast>, div)
    ReactDOM.unmountComponentAtNode(div)
})
