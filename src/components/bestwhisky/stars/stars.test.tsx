import React from 'react'
import ReactDOM from 'react-dom'
import Stars from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const views: Array<{ author: string, stars: number, view?: string }> = []
    ReactDOM.render(<Stars views={views} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
