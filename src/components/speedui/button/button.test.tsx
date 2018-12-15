import React from 'react'
import ReactDOM from 'react-dom'
import Button from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const handleClick: (e: React.MouseEvent<HTMLElement>) => void = () => {
        //
    }
    ReactDOM.render(<Button handleClick={handleClick} label='' />, div)
    ReactDOM.unmountComponentAtNode(div)
})
