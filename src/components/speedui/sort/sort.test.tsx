import React from 'react'
import ReactDOM from 'react-dom'
import Sort, { ISortProps } from '.'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const props: ISortProps = {
        datas: {},
        defaultValue: '',
        entries: [{ name: '', value: '' }],
        onChange: () => {
            //
        }
    }
    ReactDOM.render(<Sort {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
})
