import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { DataService, AuthService } from './../../../../shared/providers/providers'
import { ICard, IUser, EventsTypes } from './../../../../shared/interfaces'
import { CardDetailsPage } from './../../../pages'
import { Subscription } from 'rxjs/Subscription'
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-cards',
  templateUrl: 'favorites-cards.html'
})
export class FavoritesCardsPage implements OnInit {
  favoriteCards: Array<ICard> = []
  queryText: string = ""
  user: IUser;
  isUser: boolean = false
  subscription: Subscription
  loader: Loading
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private events: Events) {
    console.log("in constructor")
    this.events.subscribe(EventsTypes.userUpdated, () => this.ngOnInit())
  }


  ngOnInit() {

    console.log("in on init")
    this.loader = this.loadingController.create({
      content: 'gettin user info...',
    });
    this.loader.present()
      .then(() => {
        this.authService.getCurrentUser()
          .then(user => {
            this.user = user
            this.isUser = true;
            this.loader.dismiss().catch(() => console.log("error in dismissing"))
          })
      }).catch(err => console.log("can't get user" + err))
  }
  refreshAll(refresher) {
    refresher.complete()
    this.ngOnInit()
  }
}