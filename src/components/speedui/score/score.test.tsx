import React from 'react'
import ReactDOM from 'react-dom'
import Score, { IScoreProps } from '.'
// import StarField, { IStarFieldProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: IScoreProps = {
        maxScore: 5
    }
    ReactDOM.render(<Score {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
