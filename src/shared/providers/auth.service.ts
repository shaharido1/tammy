import { Injectable } from '@angular/core';
import { FirebaseAuthState, AngularFire, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import { IUser, Paths } from './../interfaces'
import { MappingService } from './mapping.service'

@Injectable()
export class AuthService {
  auth: FirebaseAuthState
  user: IUser
  constructor(public angularFire: AngularFire) {
    this.getCurrentUser()
  }
  ///inject firebase - for delete, change password, etc. 
  createUser(user): Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
      debugger
      this.angularFire.auth.createUser({ email: user.email, password: user.password })
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

  private registerUserToDataBase(user: IUser, uid: string): firebase.Promise<void> {
    debugger
    return this.angularFire.database.object(`${Paths.users}/${uid}`)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        school: user.school,
        username: user.username,
        counterComments: 0,
        allocatedCards: [],
        commants: []
      })

  }

  login(cradentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.angularFire.auth.login(cradentials)
  }

  logOutUser(): void {
    this.angularFire.auth.logout();
  }

  getCurrentUser(): Promise<IUser> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        resolve(this.user)
      }
      else {
        this.angularFire.auth.subscribe((auth) => {
          if (auth) {
            this.angularFire.database.object(`${Paths.users}/${auth.uid}`)
              .subscribe((user) => {
                this.user = MappingService.mapUserfromDbToApp(user)
                resolve(this.user)
              }, err => {
                console.log(err + "error in database")
                reject(err)
              })
          }
        }, err => {
          console.log(err + "error in auth")
          reject(err)
        })
      }
    })
  }



}
