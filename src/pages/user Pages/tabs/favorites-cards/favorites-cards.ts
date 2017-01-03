import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService, AuthService } from './../../../../shared/providers/providers'
import { ICard, IUser } from './../../../../shared/interfaces'
import { CardDetailsPage } from './../../../pages'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'page-cards',
  templateUrl: 'favorites-cards.html'
})
export class FavoritesCardsPage implements OnDestroy, OnInit{
  favoriteCards: Array<ICard> = []
  queryText: string = ""
  user: IUser;
  subscription : Subscription
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }  

  ngOnInit() {
  this.authService.getCurrentUser()
      .then(user => {
        this.user = user
        this.favoriteCards = []
        if (this.user.favoriteCards) {
          this.subscription=this.dataService.getListOfCards(false)
            .subscribe((card) => {
              this.favoriteCards.push(card)
            },
            (err) => {
              console.log(err)
            })
        }
        else { }
      })
  }
}


