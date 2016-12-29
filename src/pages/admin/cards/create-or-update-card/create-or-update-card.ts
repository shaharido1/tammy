import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ICard, IUser, IRefUser, categories } from './../../../../shared/interfaces'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminCardsPage } from './../../../pages'
import { DataService } from './../../../../shared/providers/providers'
import * as _ from 'lodash'

@Component({
  selector: 'page-create-or-update-card',
  templateUrl: 'create-or-update-card.html'
})
export class CreateOrUpdateCardPage implements OnInit {
  oldUserAllocation: Array<IRefUser> = []
  updateOrSave: Boolean = true;
  queryText: string = ""
  allUsers: Array<any>
  categorizedUsers: Array<any>
  displayUsers: Array<IUser>
  categories: Array<boolean>
  cardForm: FormGroup;
  name: AbstractControl
  category: AbstractControl
  card: ICard = {
    allocatedUsers: [],
    category: { key: "", name: "" },
    commants: [],
    urlToFile: "",
    name: "",
    key: ""
  }
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private loadingController: LoadingController) { }

  ngOnInit() {
    let loader = this.loadingController.create({
      content: "loading cards list"
    })

    loader.present()
    if (this.navParams.data.name) {
      this.card = this.navParams.data
          Object.assign(this.oldUserAllocation, this.card.allocatedUsers)
    }
    else {this.updateOrSave = false}
    this.getDataFromServer()
    loader.dismiss()

    
    
    this.cardForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required])],
      'category': ['', Validators.compose([Validators.required])]
    });

    for (let field in this.cardForm.value) {
      this.cardForm.patchValue({ [field]: this.card[field] })
      this[field] = this.cardForm.controls[field]
    }
  }

  getDataFromServer() {
    this.dataService.getAllCategories().subscribe(res => {
      console.log(res)
      this.categories = res
    })
    this.dataService.getAllUsers()
      .subscribe((res) => {
        console.log(res)
        this.allUsers = res
        this.mapUsersForTuggole()
        this.sortUsers()
      },
      (err) => {
        console.log(err)
      })
  }
  mapUsersForTuggole() {
    if (this.card.allocatedUsers) {
    this.allUsers.map(user => {
      debugger
      user.checked = false;
      for (let i = 0; i < this.card.allocatedUsers.length; i++) {
        if (this.card.allocatedUsers[i].key == user.key) {
          user.checked = true;
          break
        }
      }
    })
    }
  }

  sortUsers() {
    this.categorizedUsers =
      _.chain(this.allUsers)
        //for each team in array
        .filter(user => {
          if (!this.queryText || user.fullName.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
            return user
        })
        //groupby (array, function/string) -> if string, looking for the same value 
        .groupBy('school')
        //create pairs of key and value 
        .toPairs()
        //zip -> _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
        //=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
        .map(item => _.zipObject(['schoolName', 'schoolUsers'], item))
        //unwrap the chain value
        .value();
    this.displayUsers = this.categorizedUsers
  }
  
  pushUserToCard(event, user) {
    //have to init the array on the funciton
    if (!this.card.allocatedUsers) {this.card.allocatedUsers=[]}
    event ? this.card.allocatedUsers.push({ key: user.key, fullName: user.fullName })
      : this.card.allocatedUsers = this.card.allocatedUsers
        .filter(cardUser => cardUser.key !== user.key)
  }

  saveUpdateCard(filledcardForm) {
    for (let field in filledcardForm) {
      this.card[field] = filledcardForm[field]
    }
    console.log(this.card)
    this.updateOrSave ?
      this.dataService.updateCard(this.card, this.oldUserAllocation)
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
