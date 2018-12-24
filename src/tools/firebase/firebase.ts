import app from 'firebase/app'
import 'firebase/auth'

const config = {
    apiKey: 'AIzaSyBpIPKl_FHlp_v-A-NoZdiQCGCvFe-ZTKE',
    authDomain: 'best-whisky.firebaseapp.com',
    databaseURL: 'https://best-whisky.firebaseio.com',
    messagingSenderId: '1073973510826',
    projectId: 'best-whisky',
    storageBucket: 'best-whisky.appspot.com'
}

class Firebase {
    auth: app.auth.Auth

    constructor() {
        app.initializeApp(config)
        this.auth = app.auth()
    }

    doCreateUserWithEmailAndPassword = (email: string, password: string) => this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email: string, password: string) => this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = (password: string) => this.auth.currentUser && this.auth.currentUser.updatePassword(password)
}

export default Firebase
