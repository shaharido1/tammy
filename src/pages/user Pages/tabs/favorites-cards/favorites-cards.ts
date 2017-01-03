import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService, AuthService } from './../../../../shared/providers/providers'
import { ICard, IUser } from './../../../../shared/interfaces'
import { CardDetailsPage } from './../../../pages'

@Component({
  selector: 'page-cards',
  templateUrl: 'favorites-cards.html'
})
export class FavoritesCardsPage {
  favoriteCards: Array<ICard> = []
  queryText: string = ""
  user: IUser;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {


    this.authService.getCurrentUser()
      .then(user => {
        debugger
        this.user = user
        this.favoriteCards = []
        if (this.user.favoriteCards) {
          this.dataService.getListOfCards(false)
            .subscribe((card) => {
              debugger
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


