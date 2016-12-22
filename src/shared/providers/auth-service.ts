import { Injectable, Inject } from '@angular/core';
import { AuthProviders, FirebaseAuth, FirebaseAuthState, AuthMethods, FirebaseListObservable, AngularFire } from 'angularfire2';
import { EmailPasswordCredentials } from './../../../node_modules/angularfire2/auth/auth_backend.d'

@Injectable()
export class AuthService {
  constructor(public firebaseAuth: FirebaseAuth, public angularFire : AngularFire ) {
   }
   //on @inject
   //@Inject(DataService) dataService: DataService
   //http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html
  
  createUser(user): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.createUser({ email: user.email, password: user.password })
        .then(() => {
          console.log("user auth success")
          this.angularFire.database.list('users').push(user)
            .then((auth) => {
              console.log("user save in DB" + auth)
              resolve(auth)
            })
            .catch((err) => {
              console.log("user fail to save in DB" + err)
              reject(err)
            })
        }).catch((err) => {
            console.log("fail to auth" + err)
            reject(err)
        })
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
