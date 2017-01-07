import { Injectable } from '@angular/core';
import { FirebaseAuthState, AngularFire, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import { IUser, Paths, EventsTypes } from './../interfaces'
import { MappingService } from './mapping.service'
import { Events } from 'ionic-angular';

@Injectable()
export class AuthService {
  auth: AngularFireAuth
  user: IUser
  constructor(public angularFire: AngularFire, public events: Events) {
    this.getCurrentUser()
  }
  ///inject firebase - for delete, change password, etc. 
  createUser(user): Promise<AngularFireAuth> {
    return new Promise((resolve, reject) => {
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

  logOutUser(): firebase.Promise<any> {
    this.user = null;
    return this.angularFire.auth.logout();
  }

  getCurrentUser(): Promise<IUser> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        resolve(this.user)
      }
      else {
        this.getAuthUser().subscribe((auth) => {
          if (auth) {
            this.getUserData(auth)
            .then((user) => {resolve(user)})
            .catch((err) => reject(err))
          }
          else {resolve()}
        }, err=> reject("can't auth"))
      }
    })
  }

  private getAuthUser(): AngularFireAuth {
    return this.angularFire.auth
  }

  getUserData(auth: FirebaseAuthState): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.angularFire.database.object(`${Paths.users}/${auth.uid}`)
        .subscribe((user) => {
          this.user = MappingService.mapUserfromDbToApp(user)
          this.events.publish(EventsTypes.userConnected, this.user)
          resolve(this.user)
        }, err => {
          console.log(err + "error in database")
          reject(err)
        })
    })
  }

  ////////////////////admin////////////////////////////
  makeUserAdmin(user: IUser): firebase.Promise<void> {
    return this.angularFire.database.object(`${Paths.admins}/${user.key}`).update({ fullName: user.fullName })
  }
  removeAdmin(user: IUser): firebase.Promise<void> {
    return this.angularFire.database.object(`${Paths.admins}/${user.key}`).remove()
  }

  isAdmin(user: IUser): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.angularFire.database.object(`${Paths.admins}/${user.key}`).subscribe((res) => {
        if (res.fullName) { resolve(true) }
        else { resolve(false) }
      }, err => {
        console.log(err)
        reject(err)
      })
    })
  }


}
