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

    updateCurrentUserProfile = (displayName: string, photoURL: string) => {
        const user = this.auth.currentUser
        if (user) {
            user.updateProfile({ displayName, photoURL })
        }
    }

    getCurrentUserProfile = () => this.auth.currentUser && this.auth.currentUser.providerData

    getCurrentUser = () => this.auth.currentUser

    sendEmailVerification = () => this.auth.currentUser && this.auth.currentUser.sendEmailVerification()

    createUserWithEmailAndPassword = (email: string, password: string) => this.auth.createUserWithEmailAndPassword(email, password)

    signInWithEmailAndPassword = (email: string, password: string) => this.auth.signInWithEmailAndPassword(email, password)

    signOut = () => this.auth.signOut()

    resetPassword = (email: string) => this.auth.sendPasswordResetEmail(email)

    updatePassword = (password: string) => this.auth.currentUser && this.auth.currentUser.updatePassword(password)
}

export default Firebase
