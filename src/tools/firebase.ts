import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Utils from './utils'

const config = {
    apiKey: 'AIzaSyBpIPKl_FHlp_v-A-NoZdiQCGCvFe-ZTKE',
    authDomain: 'best-whisky.firebaseapp.com',
    databaseURL: 'https://best-whisky.firebaseio.com',
    messagingSenderId: '1073973510826',
    projectId: 'best-whisky',
    storageBucket: 'best-whisky.appspot.com'
}

class Firebase {
    protected db: app.database.Database
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
    public getKey = () => this.db.ref().push().key

    public read = (location: string, pCb: (datas: app.database.DataSnapshot | null, returnType: string) => void, dispatchDatabaseEndAccessEvent: boolean = false) => {
        const counter: { [key: string]: number } = {}
        const ref = this.db.ref(location)
        const query = ref.orderByValue()
        query.on('child_added', (datas) => {
            pCb(datas, 'added')
            this.dispatchDatabaseEndAccess(location, counter, dispatchDatabaseEndAccessEvent)
        })
        query.on('child_changed', (datas) => {
            pCb(datas, 'changed')
            this.dispatchDatabaseEndAccess(location, counter, dispatchDatabaseEndAccessEvent)
        })
        query.on('child_removed', (datas) => {
            pCb(datas, 'removed')
            this.dispatchDatabaseEndAccess(location, counter, dispatchDatabaseEndAccessEvent)
        })
    }

    public async getEntry(location: string, entry: string) {
        const refLocation = this.db.ref(location + '/' + entry)
        return await refLocation.once('value', (snapshot) => snapshot)
    }

    public async add(location: string, datas: any, inLocation: boolean = false, existingKey: string | null = null) {
        const refLocation = this.db.ref(location)
        const key = existingKey || refLocation.push().key
        datas.key = key
        const updates: any = {}
        updates[key as string] = datas
        await refLocation.update(!inLocation && !location.includes(key as string) ? updates : datas)
        return key
    }

    public async update(location: string, datas: any, id: string = '') {
        await this.db.ref(id ? location + '/' + id : location).update(datas)
    }

    public async remove(location: string, id: string) {
        await this.db.ref(location + '/' + id).remove()
    }

    public async getCount(location: string) {
        const refLocation = this.db.ref(location)
        let count: number = 0
        await refLocation.once('value', (snapshot) => count = snapshot.numChildren())
        return count
    }

    private async dispatchDatabaseEndAccess(location: string, counter: { [key: string]: number }, dispatchDatabaseEndAccessEvent: boolean) {
        if (dispatchDatabaseEndAccessEvent) {
            counter[location] = counter[location] === undefined ? 1 : counter[location] + 1
            const count = await this.getCount(location)
            if (counter[location] === count) {
                Utils.dispatchEvent('databaseEndAccess', {})
                counter[location] = 1
            }
        }
    }
}

export default Firebase
