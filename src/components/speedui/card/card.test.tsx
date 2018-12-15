import React from 'react'
import ReactDOM from 'react-dom'
import Card from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const handleClick: (e: React.MouseEvent<HTMLElement>) => void = () => {
        //
    }
    ReactDOM.render(<Card name='testname' clickAction={handleClick} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
