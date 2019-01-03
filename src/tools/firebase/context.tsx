import React from 'react'

const value: any = null
// tslint:disable-next-line:variable-name
const FirebaseContext = React.createContext(value)

// tslint:disable-next-line:variable-name
export const withFirebase = (Component: any) => (props: any) => (
    <FirebaseContext.Consumer>
        {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
)

export default FirebaseContext
