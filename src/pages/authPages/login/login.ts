import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from './../../../shared/providers/providers'
import { IUser } from './../../../shared/interfaces'
import { FirebaseAuthState } from 'angularfire2';

import { SignUpPage } from './../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmailValidator } from './../../../shared/validator/email.validator'
import { MyApp } from './../../../app/app.component'

@Component({
  selector: 'LoginPage',
  templateUrl: 'Login.html'
})
export class LoginPage implements OnInit {
  loader: any

  logInForm: FormGroup;
  email: AbstractControl
  password: AbstractControl

  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.logInForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
    for (let field in this.logInForm.value) {
      this[field] = this.logInForm.controls[field]
    }

  }

  onSubmitLogIn(logInfilledForm) {
    let loader = this.loadingController.create({ content: "loging in..." })
    loader.present().then(() => {
      console.log("trying to login with" + logInfilledForm.email)
      this.authService.login({
        email: logInfilledForm.email,
        password: logInfilledForm.password
      }).then((auth: FirebaseAuthState) => {
        console.log("log in succussfuly with user key" + auth.uid)
        this.authService.getUserData(auth)
          .then((user: IUser) => {
            console.log("user data return from Db" + user.fullName)
            loader.dismiss()
              .then(() => {this.onSuccess()})
              .catch((()=>console.log("problem in dismissing1")))
            }).catch(err=> console.log("can't get user data"))
      }).catch(err => loader.dismiss()
      .then(err => console.log("can't auth"))
      .catch(() => console.log("problem in dismissing2")))
    }).catch((err) => loader.dismiss().catch(() => console.log("problem in dismissing2")))
  }

  onSuccess() {
    let toastSuccess = this.toastController.create({
      message: "loged in succussfuly",
      duration: 3000,
      position: 'bottom',
    })
    toastSuccess.present()
    this.navCtrl.setRoot(MyApp)
  }

  onFail(err) {
    console.log(err)
    let errMessage: string;
    errMessage = (err.code == "auth/user-not-found") ? "this user doesn't" : "fail to log in"
    let toasterror = this.toastController.create({
      message: errMessage,
      duration: 3000,
      position: 'bottom'
    })
    toasterror.present()
  }

  toTabPage() {
    this.navCtrl.setRoot(MyApp)
  }


  goToSignUpPage() {
    this.navCtrl.push(SignUpPage)
  }
}

