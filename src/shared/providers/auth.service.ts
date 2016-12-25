import { Injectable } from '@angular/core';
import { FirebaseAuthState, AngularFire, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import {ErrorMesseges} from './../interfaces'
@Injectable()
export class AuthService {
  constructor(public angularFire: AngularFire) {
  }

  createUser(user): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
        this.angularFire.auth.createUser({ email: user.email, password: user.password })
          .then(() => {
            console.log("user auth success")
            this.registerUserToDataBase(user)
              .then(() => resolve("user saved in DB"))
              .catch((err) => reject(err))
          }).catch((err) => {
            console.log("fail to auth" + err)
            reject(err)
          })
    })
  }


  private registerUserToDataBase(user): firebase.Promise<any> {
    return this.angularFire.database.object(`users/${user.username}`)
      .set({
        email: user.email,
        phone: user.phone,
        school: user.school
      })

  }

  login(cradentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.angularFire.auth.login(cradentials)
  }

  logOutUser(): void {
    this.angularFire.auth.logout();
  }

  getUser(): AngularFireAuth {
    return this.angularFire.auth
  }

  isSignedIn(): boolean {
    return this.angularFire.auth.getAuth() !== null
  }
}
