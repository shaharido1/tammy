import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, IRefCard } from './../../../shared/interfaces'
import * as _ from 'lodash'
import { CardDetailsPage } from './../../pages'
import { Subscription } from 'rxjs/Subscription.d'

@Component({
  selector: 'page-all-user-cards',
  templateUrl: 'all-cards-list.html'
})

export class AllcardsListPage implements OnInit, OnDestroy {
  categorizedCards: Array<any>
  displayCards: Array<IRefCard>
  queryText: string = ""
  user: IUser
  loader : Loading
  subscription : Subscription
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) {

  }

  ngOnInit() {
    this.loader = this.loadingController.create({
      content: 'gettin user info...',
    });
    this.loader.present()
      .then(() => {
        this.authService.getCurrentUser()
          .then(user => {
            this.user = user
            console.log("this user" + this.user.fullName)
            debugger
            console.log("subscribe to user")
            this.sortCards()
            this.loader.dismiss().catch(() => console.log("error in dismissing"))
          })
      }).catch(err => {
        this.loader.dismiss().catch(() => console.log("error in dismissing"))
        console.log("can't get user" + err)
      })
  }
  ngOnDestroy(){
    console.log("unsubscribe from user")
    this.loader.dismiss()
  }

  refreshAll(refresher) {
    refresher.complete()
    this.ngOnInit()
  }

  sortCards() {
    this.categorizedCards =
      _.chain(this.user.allocatedCards)
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

  pushToCardDetails($event, card: IRefCard) {
    this.navCtrl.push(CardDetailsPage, card)
  }

}
