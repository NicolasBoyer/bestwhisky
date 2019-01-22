import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: 'AIzaSyBpIPKl_FHlp_v-A-NoZdiQCGCvFe-ZTKE',
    authDomain: 'best-whisky.firebaseapp.com',
    databaseURL: 'https://best-whisky.firebaseio.com',
    messagingSenderId: '1073973510826',
    projectId: 'best-whisky',
    storageBucket: 'best-whisky.appspot.com'
}

class Firebase {
    // A remettre en protected
    db: app.database.Database
    protected auth: app.auth.Auth

    constructor() {
        app.initializeApp(config)
        this.auth = app.auth()
        this.db = app.database()
    }

    /* AUTH API */
    public sendEmailVerification = () => this.auth.currentUser && this.auth.currentUser.sendEmailVerification()

    public createUserWithEmailAndPassword = (email: string, password: string) => this.auth.createUserWithEmailAndPassword(email, password)

    public signInWithEmailAndPassword = (email: string, password: string) => this.auth.signInWithEmailAndPassword(email, password)

    public signOut = () => this.auth.signOut()

    public resetPassword = (email: string) => this.auth.sendPasswordResetEmail(email)

    public updatePassword = (password: string) => this.auth.currentUser && this.auth.currentUser.updatePassword(password)

    public updateCurrentUserProfile = (displayName: string, photoURL: string) => {
        const user = this.auth.currentUser
        if (user) {
            user.updateProfile({ displayName, photoURL })
        }
    }

    public getCurrentUser = (pCb: (user: app.User | null) => void) => this.auth.onAuthStateChanged((user) => pCb(user))

    public getCurrentUserProfile = (pCb: (userProfile: app.UserInfo | null | null) => void) => this.auth.onAuthStateChanged((user) => user && pCb(user.providerData[0]))

    /* DATABASE API */
    public async add(location: string, datas: any, inLocation: boolean = false) {
        const refLocation = this.db.ref(location)
        const key = refLocation.push().key
        datas.id = key
        const updates: any = {}
        updates[key as string] = datas
        await refLocation.update(!inLocation ? updates : datas)
        return key
    }

    public async update(location: string, id: string, datas: any) {
        await this.db.ref(location + '/' + id).update(datas)
    }

    public async remove(location: string, id: string) {
        await this.db.ref(location + '/' + id).remove()
    }
}

export default Firebase
