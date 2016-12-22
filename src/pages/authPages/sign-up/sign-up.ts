import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from './../../../shared/providers/providers'
import { TabsPage } from './../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {EmailValidator } from './../../../shared/validator/email.validator'

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})

export class SignUpPage implements OnInit {
  loader: any;

  createAccountForm: FormGroup;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  dateOfBirth: AbstractControl;
  phone: AbstractControl;
  school: AbstractControl;
  schoolList: Array<String>;

  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder) {

    this.schoolList = ['a', 'b', 'c']
  }

  ngOnInit() {
    this.createAccountForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      'school': ['', Validators.compose([Validators.required])]
    });

    this.email = this.createAccountForm.controls['email'];
    this.password = this.createAccountForm.controls['password'];
    this.username = this.createAccountForm.controls['username'];
    this.school = this.createAccountForm.controls['school'];
    this.phone = this.createAccountForm.controls['phone'];


  }

  onSignUpSubmit(filledAccountForm) {
    this.loader = this.loadingController.create({ content: "regestiring" })
    this.loader.present();
    this.authService.createUser({
      email: filledAccountForm.email,
      password: filledAccountForm.password,
      school: filledAccountForm.school,
      phone: filledAccountForm.phone,
      username: filledAccountForm.username
    })
      .then(this.onSuccess)
      .catch(this.onFail)
  }

  onSuccess(authdata) {
    console.log(authdata)
    let toastSuccess = this.toastController.create({
      message: "new user created",
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    })
    toastSuccess.present()
    this.loader.dismiss()
    this.navCtrl.popToRoot(TabsPage)
  }

  onFail(err) {
    console.log(err)
    let toasterror = this.toastController.create({
      message: "fail to sign up",
      duration: 3000,
      position: 'bottom'
    })
    toasterror.present()
    this.loader.dismiss()
  }



}