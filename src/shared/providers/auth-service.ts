import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import { AngularFire, FirebaseListObservable } from 'angularfire2'

@Injectable()
export class AuthService {

  constructor(public firebaseAuth: FirebaseAuth, public angularFire: AngularFire) {}

  createUser(cradentials): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.createUser(cradentials).then(() => {
        this.angularFire.database.list('users').push({ email: cradentials.email })
        resolve()
      }).catch((err) => reject(err))
    })
  }

  login(cradentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.firebaseAuth.login(cradentials)
  }

  logOutUser(): void {
    console.log("log out" + this.firebaseAuth.logout())
    this.firebaseAuth.logout();
  }

  getUser(): FirebaseAuth {
    return this.firebaseAuth
  }

  isSignedIn(): boolean {
    console.log(this.firebaseAuth.getAuth())
    return this.firebaseAuth.getAuth() !== null
  }
}
