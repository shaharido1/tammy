import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/data.service'
import { AdminCardDetailsPage } from './../../../pages'
import { ICard } from './../../../../shared/interfaces'
import * as _ from 'lodash'
import { Subscription } from 'rxjs/Subscription.d'

@Component({
  selector: 'admin-cards',
  templateUrl: 'admin-cards-list.html'
})
export class AdminCardsListPage implements OnInit, OnDestroy {
  allCards: Array<ICard>
  categorizedCards: Array<any>
  displayCards: Array<ICard>
  queryText: string = ""
  subscription: Subscription

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    let loader = this.loadingController.create({
      content: "loading cards list"
    })
    loader.present().then(() => {
      this.subscription = this.dataService.getAllCards()
        .subscribe((cards: ICard[]) => {
          this.allCards = cards
          this.sortCards()
          loader.dismiss().catch(()=>console.log("error in dismissing"))

          //  this.filterCardsList = this.allCardsList
        },
        (err) => {
          console.log(err)
          loader.dismiss().catch(()=>console.log("error in dismissing"))
        })
    }).catch(()=> console.log("error in presenting"))
  }

  ngOnDestroy() {
    console.log("unsubscribe from all users list")
    this.subscription.unsubscribe()
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

  editCard($event, card) {
    console.log(card)
    this.navCtrl.push(AdminCardDetailsPage, card)
  }
  refreshAll(refresher) {
    refresher.complete()
    this.ngOnInit()
  }
  createCard() {
    this.navCtrl.push(AdminCardDetailsPage)
  }

  deleteClassList() {
    let confirm = this.alertController.create({
      title: 'remove all?',
      message: 'Are you sure you want to remove all cards from the list?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dataService.deleteAllCards().then(() => {
              this.toastController.create({
                message: 'You have delted the entire list',
                duration: 2000,
                position: 'bottom'
              }).present()
            }).catch(() => {
              this.toastController.create({
                message: 'operation faild',
                duration: 2000,
                position: 'bottom'
              }).present()
            })
          }
        },
        { text: 'No' }
      ]
    });
    confirm.present();
  }

}
