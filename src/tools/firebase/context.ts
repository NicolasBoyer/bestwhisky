import React from 'react'

const value: any = null
// tslint:disable-next-line:variable-name
const FirebaseContext = React.createContext(value)

export const withFirebase = (Component) => (props) => (
    // <FirebaseContext.Consumer>
    //     {(firebase) => <Component {...props} firebase={firebase} />}
    // </FirebaseContext.Consumer>
)

export default FirebaseContext
