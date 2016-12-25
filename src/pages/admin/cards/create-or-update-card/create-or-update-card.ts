import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ICard, categories } from './../../../../shared/interfaces'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RegisterUserToCardPage, AdminCardsPage } from './../../../pages'
import { DataService } from './../../../../shared/providers/providers'
@Component({
  selector: 'page-create-or-update-card',
  templateUrl: 'create-or-update-card.html'
})
export class CreateOrUpdateCardPage implements OnInit {
  updateOrSave: Boolean = true;

  categories: Array<boolean>
  cardForm: FormGroup;
  title: AbstractControl
  category: AbstractControl
  card: ICard = {
    AllocatedUsers: [],
    category: categories.CATEGORYA,
    commants: [],
    title: "",
    UrlToFile: ""
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    public dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAllCategories().subscribe(res => {
      console.log(res)
      this.categories = res
    })
    this.navParams.data.title ?
      this.card = this.navParams.data
      : this.updateOrSave = false

    this.cardForm = this.formBuilder.group({
      'title': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])]
    });

    for (let field in this.cardForm.value) {
      this.cardForm.patchValue({ [field]: this.card[field] })
      this[field] = this.cardForm.controls[field]
    }
  }

  saveUpdateCard(filledSchoolForm) {
    for (let field in filledSchoolForm) {
      this.card[field] = filledSchoolForm[field]
    }

    //validate that there is no name like it
    this.updateOrSave ?
      this.dataService.updateCard(this.card)
        .then((res) => this.onSuccess(res))
        .catch((err) => this.onFail(err))
      : this.dataService.saveNewCard(this.card)
        .then((res) => this.onSuccess(res))
        .catch((err) => this.onFail(err))
  }

  private onSuccess(res) {
    let toastSuccess = this.toastController.create({
      message: this.updateOrSave ? "updated card" : "saved new card",
      duration: 3000,
      position: 'bottom'
    })
    console.log(res)
    toastSuccess.present()
    this.navCtrl.setRoot(AdminCardsPage)
  }

  private onFail(err) {
    let toastfail = this.toastController.create({
      message: this.updateOrSave ? "fail to update card" : "fail to save new card",
      duration: 3000,
      position: 'bottom'
    })
    console.log(err)
    toastfail.present()
  }


}


    // debugger
    // this.logInForm.setValue({email: "ttt", password:"sdfsdf"})
    // this.email = this.logInForm.controls['email'];
    // this.password = this.logInForm.controls['password'];