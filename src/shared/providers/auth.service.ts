import { Injectable } from '@angular/core';
import { FirebaseAuthState, AngularFire, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import {IUser, Paths} from './../interfaces'
@Injectable()
export class AuthService {
  constructor(public angularFire: AngularFire) {
  }
///inject firebase - for delete, change password, etc. 
  createUser(user): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
        debugger
        this.angularFire.auth.createUser({email: user.email, password: user.password })
          .then((auth) => {
            console.log("user auth success")
            this.registerUserToDataBase(user, auth.uid)
              .then(() => resolve())
              .catch((err) => reject(err))//if fail to save in db, should delete user as well.. 
          }).catch((err) => {
            console.log("fail to auth" + err)
            reject(err)
          })
    })
  }

  private registerUserToDataBase(user: IUser, uid: string): firebase.Promise<any> {
    debugger
    return this.angularFire.database.object(`${Paths.users}/${uid}`)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        school: user.school,
        username: user.username
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

}
