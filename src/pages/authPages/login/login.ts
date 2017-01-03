import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from './../../../shared/providers/providers'
import { SignUpPage, TabsPage } from './../../pages'
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
    //var loader = this.loadingController.create({ content: "loging in...", dismissOnPageChange: true })
    //loader.present();
    this.authService.login({
      email: logInfilledForm.email,
      password: logInfilledForm.password
    })
      .then((auth) =>  
        {this.authService.getCurrentUser()
        this.navCtrl.setRoot(TabsPage)
      }) 
        //(authdata) => {
      //this.onSuccess(authdata)
      //loader.dismiss()
      //this.navCtrl.setRoot(TabsPage)
      .catch((err) => this.onFail(err))
  }

  onSuccess(authdata) {
     console.log(authdata)
    //!!!!!!!!!!!!!!!!!!some wired bug with the loader....!!!!!!!!!!1
    let toastSuccess = this.toastController.create({
      message: "loged in succussfuly",
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    })
    toastSuccess.present()    
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

