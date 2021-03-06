import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService, DataService, MappingService } from './../../../shared/providers/providers'
import { MyApp } from './../../../app/app.component'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmailValidator } from './../../../shared/validator/email.validator'
import { ISchool, ErrorMesseges, IUser } from './../../../shared/interfaces'
import {Subscription} from 'rxjs/Subscription.d'

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})

export class SignUpPage implements OnInit, OnDestroy {
  schoolList: Array<ISchool>
  //creating the user with no interface//
  createAccountForm: FormGroup;
  firstName: AbstractControl;
  lastName: AbstractControl;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  dateOfBirth: AbstractControl;
  phone: AbstractControl;
  school: AbstractControl;
  subscription : Subscription

  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private dataService: DataService) {
  }

  ngOnInit() {
    this.createAccountForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([Validators.required])],
      'lastName': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      'school': ['', Validators.compose([Validators.required])]
    });

    for (let field in this.createAccountForm.value) {
      this[field] = this.createAccountForm.controls[field]
    }

    this.subscription=this.dataService.getAllSchools().subscribe(
      (res) => { this.schoolList = res; },
      (err) => console.log(err))
  }
  
  onSignUpSubmit(filledAccountForm: IUser) {
    let loader = this.loadingController.create({ content: "regestiring" })

    ///////////some wired bug with the loader.. can't pass any parmas to on success/////////
    loader.present().then(() => {
      this.authService.createUser(filledAccountForm)
        .then(() => loader.dismiss().then(() => this.onSuccess()))
        .catch((err) => loader.dismiss().then((err) => this.onFail(err)))
    })
    //
  }

  onSuccess() {
    console.log("user saved in DB")
    let toastSuccess = this.toastController.create({
      message: "new user created",
      duration: 3000,
      position: 'bottom',
    })
    toastSuccess.present()
    this.navCtrl.setRoot(MyApp)
  }

  onFail(err) {
    console.log(err)
    let errMessage: string;
    //need to handle errors...
    switch (err) {
      case ErrorMesseges.premissonDenied: errMessage = "username might already exists"; break
      case ErrorMesseges.emailAlreadyExist: errMessage = "email already exists"; break;
      default: errMessage = "fail to sign up";
    }

    let toasterror = this.toastController.create({
      message: errMessage,
      duration: 3000,
      position: 'bottom'
    })
    toasterror.present()
  }

  ngOnDestroy(){
  console.log("unsubscribe from all school list(onsignup page)")
  this.subscription.unsubscribe()
  }

}
