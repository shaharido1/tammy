import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService} from './../../../shared/providers/providers'
import {SignUpPage, TabsPage } from './../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {EmailValidator } from './../../../shared/validator/email.validator'

@Component({
  selector: 'LoginPage',
  templateUrl: 'Login.html'
})
export class LoginPage implements OnInit {

  logInForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  loader: any

  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder : FormBuilder) { }

  ngOnInit() {
    this.logInForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.email = this.logInForm.controls['email'];
    this.password = this.logInForm.controls['password'];
  }


  //////////////////////////////////

  onSubmitLogIn(logInfilledForm) {
    this.loader = this.loadingController.create({ content: "loging in..." })
    this.loader.present();
    this.authService.login({
      email: logInfilledForm.email,
      password: logInfilledForm.password
    })
      .then(this.onSuccess)
      .catch(this.onFail)
  }
  
    onSuccess (authdata) {
        console.log (authdata)
        let toastSuccess = this.toastController.create({
          message: "loged in succussfuly",
          duration: 3000,
          position: 'bottom',
          dismissOnPageChange: true
        })
        toastSuccess.present()
        this.loader.dismiss()
        this.navCtrl.popToRoot(TabsPage)
    }

    onFail (err) {
        console.log(err)
        let toasterror = this.toastController.create({
          message: "fail to log in",
          duration: 3000,
          position: 'bottom'
        })
        toasterror.present()
        this.loader.dismiss()
    }

  
  goToSignUpPage() {
    this.navCtrl.push(SignUpPage)
  }
}

