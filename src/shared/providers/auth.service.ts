import { Injectable, OnInit } from '@angular/core';
import { FirebaseAuthState, AngularFire, AngularFireAuth } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'
import { IUser, Paths, EventsTypes, storageKeys } from './../interfaces'
import { MappingService } from './mapping.service'
import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit {
  auth: FirebaseAuthState
  user: IUser
  constructor(public angularFire: AngularFire,
    public events: Events,
    public storage: Storage,
    public toastController: ToastController) {
  }

  ngOnInit() {

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
        countertopics: 0,
        allocatedCards: [],
        topics: []
      })

  }

  login(cradentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.angularFire.auth.login(cradentials)
  }

  logOutUser(): firebase.Promise<any> {
    this.user = null;
    return this.angularFire.auth.logout();
  }

  getCurrentUser(): Observable<IUser> {
    debugger
    return new Observable(observer => {
      this.angularFire.auth.subscribe((auth) => {
        if (!auth) { observer.error() }
        else {
          this.angularFire.database.object(`${Paths.users}/${auth.uid}`).subscribe((user) => {
            observer.next(MappingService.mapUserfromDbToApp(user))
          })
        }
      }, err => observer.error(err))
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
