import { Component, OnInit} from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService, DataService } from './../../../shared/providers/providers'
import { TabsPage } from './../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {EmailValidator } from './../../../shared/validator/email.validator'
import {Schools, ErrorMesseges} from './../../../shared/interfaces'
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
  schoolList : Array<Schools>

  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private dataService : DataService) {
  }

  ngOnInit() {
    this.createAccountForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      'school': ['', Validators.compose([Validators.required])]
    });

    for (let field in this.createAccountForm.value) {  
      this[field] = this.createAccountForm.controls[field]
    }

    this.dataService.getAllSchools().subscribe( 
      (res) => {this.schoolList=res; console.log(res)},
      (err)=>console.log(err))
  
  }

  onSignUpSubmit(filledAccountForm) {
    //this.loader = this.loadingController.create({ content: "regestiring" })
    //this.loader.present();
    ///////////some wired bug with the loader.. can't pass any parmas to on success/////////
    this.authService.createUser({
      email: filledAccountForm.email,
      password: filledAccountForm.password,
      school: filledAccountForm.school,
      username: filledAccountForm.username,
      phone: filledAccountForm.phone
    })
      .then( (authdata)=> this.navCtrl.setRoot(TabsPage))
      .catch( (err) => this.onFail(err))
  }

  onSuccess(authdata) {
    console.log("the userdata" + authdata)
    let toastSuccess = this.toastController.create({
      message: "new user created",
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    })
    toastSuccess.present()
    
  }

  onFail(err) {
    debugger
    console.log(err)
    let errMessage: string;
    //need to handle errors...
    switch(err) {
    case ErrorMesseges.premissonDenied: errMessage = "username might already exists"; break
    case ErrorMesseges.emailAlreadyExist: errMessage= "email already exists"; break;
    default: errMessage= "fail to sign up";
    }
    
    let toasterror = this.toastController.create({
      message: errMessage,
      duration: 3000,
      position: 'bottom'
    })
    toasterror.present()
  }



}
