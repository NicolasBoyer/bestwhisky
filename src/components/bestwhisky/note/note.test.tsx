import React from 'react'
import ReactDOM from 'react-dom'
import Note from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const views: Array<{ author: string, stars: number, view?: string }> = []
    ReactDOM.render(<Note views={views} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
