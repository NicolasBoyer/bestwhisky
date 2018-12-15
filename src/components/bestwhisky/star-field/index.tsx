import React from 'react'
import Button from '../../speedui/button'
// import styles from './star-field.module.css'

// export interface IStarFieldProps {
//     //
// }

// export interface IAppState {
// }

export default class StarField extends React.Component {
    // constructor(props: IWhiskyProps) {
    //     super(props)
    //     // this.state = {
    //     // }
    // }

    public render() {
        const { } = this.props
        return (
            <div>
                <Button label='star' iconName='star-full' handleClick={this.onChange} />
            </div>
        )
    }

    protected onChange = () => {
        console.log('blipo')
    }
}
