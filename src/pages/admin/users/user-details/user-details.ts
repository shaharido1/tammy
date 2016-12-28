import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { UsersListPage } from './../../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IUser, ICard, IRefCard, ErrorMesseges } from './../../../../shared/interfaces'

@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html'
})
export class userDetailPage implements OnInit {
  user: IUser;
  allCards: Array<any>
  filterCardList: Array<any>
  queryText: string = ""
  oldCardAllocation: Array<IRefCard> = []

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController) { }


  ngOnInit() {
    this.user = this.navParams.data
    Object.assign(this.oldCardAllocation, this.user.allocatedCards)
    let loader = this.loadingController.create({
      content: "loading cards list"
    })
    loader.present(
      this.dataService.getAllCards()
        .subscribe((res) => {
          console.log(res)
          this.allCards = res
          this.mapCardsForTuggole()
          this.filterCardList = this.allCards
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }
  
  mapCardsForTuggole() {
    this.allCards.map(card => {
      card.checked = false;
      for (let i = 0; i < this.user.allocatedCards.length; i++) {
        if (this.user.allocatedCards[i].key == card.key) {
          card.checked = true;
          break
        }
      }
    })
  }

  searchList() {
    this.filterCardList = this.allCards.filter((card) => {
      if (!this.queryText || card.name.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
        return card
    })
  }

  pushCardToUser(event, card) {
    event ? this.user.allocatedCards.push({ key: card.key, name: card.name })
      : this.user.allocatedCards = this.user.allocatedCards
        .filter(UserCard => UserCard.key !== card.key)
  }

  saveUser() {
    debugger
    this.dataService.updateUser(this.user, this.oldCardAllocation)
      .then(() => this.onSuccess())
      .catch((err) => this.onFail(err))
  }

  private onSuccess() {
    let toastSuccess = this.toastController.create({
      message: "updated user",
      duration: 3000,
      position: 'bottom'
    })
    console.log()
    toastSuccess.present()
    this.navCtrl.setRoot(UsersListPage)
  }

  private onFail(err) {
    let errmesag: string;
    if (err == ErrorMesseges.premissonDenied) { errmesag = "user name might already exsist in the system" }
    else { errmesag = "fail to save new user" }
    let toastfail = this.toastController.create({
      message: errmesag,
      duration: 3000,
      position: 'bottom'
    })
    console.log("the error is  " + err)
    toastfail.present()
  }

}
