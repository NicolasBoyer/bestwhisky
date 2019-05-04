import ReactDOM from 'react-dom'
import React, { setGlobal } from 'reactn'
import App from './app'
import './index.css'
import * as serviceWorker from './serviceWorker'
import Firebase from './tools/firebase'

setGlobal({
    firebase: new Firebase(),
    homeUrl: location.href.includes('localhost') ? 'http://localhost:3000/' : 'https://best-whisky.firebaseapp.com/',
    isSubHeader: true,
    toast: {},
    user: null
})

ReactDOM.render(
    <App />,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
