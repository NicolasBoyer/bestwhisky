import React from 'react'
import ReactDOM from 'react-dom'
import Search, { ISearchProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: ISearchProps = {
        datas: {},
        fields: [],
        onChange: () => {
            //
        }
    }
    ReactDOM.render(<Search {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
