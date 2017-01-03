import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { AdminUsersListPage, AdminCardDetailsPage } from './../../../pages'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IUser, ICard, IRefCard, ErrorMesseges } from './../../../../shared/interfaces'
import * as _ from 'lodash'

@Component({
  selector: 'page-user-details',
  templateUrl: 'admin-user-details.html'
})
export class AdminUserDetailsPage implements OnInit {
  user: IUser;
  allCards: Array<any>
  categorizedCards: Array<any>
  displayCards: Array<ICard>
  queryText: string = ""
  oldCardAllocation: Array<IRefCard> = []
  isAdmin : boolean = false
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController) { }


  ngOnInit() {
    this.user = this.navParams.data
    console.log(this.user)
    Object.assign(this.oldCardAllocation, this.user.allocatedCards)

    this.dataService.getAllCards()
      .subscribe((res) => {
        console.log(res)
        this.allCards = res
        this.mapCardsForTuggole()
        this.checkIfAdmin()
        this.sortCards()
      })
    console.log("error")
}

goToCard(card) {
  this.navCtrl.push(AdminCardDetailsPage, card)
}
makeAdmin($event){
  $event? 
    this.dataService.makeUserAdmin(this.user)
      .then(()=>this.toastController.create({message:"user is now admin", duration:2000, position: "bottom"}).present())
      .catch((err)=> console.log(err)) : 
    this.dataService.removeAdmin(this.user)
      .then(()=>this.toastController.create({message:"user is now regular user", duration:2000, position: "bottom"}).present())
      .catch((err) => console.log(err))
}

checkIfAdmin() {
  this.dataService.isAdmin(this.user).then((res)=>
  this.isAdmin=res
  ).catch((err)=>console.log(err))
}

mapCardsForTuggole() {
  if (this.user.allocatedCards) {
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
}

sortCards() {
  this.categorizedCards =
    _.chain(this.allCards)
      //for each team in array
      .filter(card => {
        if (!this.queryText || card.name.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
          return card
      })
      //groupby (array, function/string) -> if string, looking for the same value 
      .groupBy('category')
      //create pairs of key and value 
      .toPairs()
      //zip -> _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
      //=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
      .map(item => _.zipObject(['categoryName', 'categoryCards'], item))
      //unwrap the chain value
      .value();
  this.displayCards = this.categorizedCards
}

pushUserToCard(event, card) {
  //have to init the array on the funciton
  if (!this.user.allocatedCards) { this.user.allocatedCards = [] }
  event ? this.user.allocatedCards.push({ key: card.key, name: card.name })
    : this.user.allocatedCards = this.user.allocatedCards
      .filter(UserCard => UserCard.key !== card.key)
}

saveUser() {
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
  this.navCtrl.setRoot(AdminUsersListPage)
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
