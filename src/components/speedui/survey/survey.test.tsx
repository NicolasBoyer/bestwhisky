import React from 'react'
import ReactDOM from 'react-dom'
import Survey, { ISurveyProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: ISurveyProps = {
        acceptButtonLabel: '',
        inputs: []
    }
    ReactDOM.render(<Survey {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
