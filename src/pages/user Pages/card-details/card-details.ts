import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, IComment, EventsTypes } from './../../../shared/interfaces'
import { CreateCommantPage } from './../../pages'
import { Subscription } from 'rxjs/Subscription'

/*
  Generated class for the CardDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-card-details',
  templateUrl: 'card-details.html'
})
export class CardDetailsPage implements OnInit, OnDestroy {
  card: ICard;
  commants: Array<IComment> = []
  loader: any;
  show = false
  commantSubscription: Subscription
  favorite: boolean = false;
  user: IUser
  firstMessage: string
  secondMessage: string
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController, public events: Events) {
    this.card = this.navParams.data
  }

  ngOnInit() {
    if (this.card.commants) { this.getCardCommant() }
    this.getUser()
  }

  getCardCommant() {
    this.commantSubscription = this.dataService.getCommantsByList(this.card.commants).subscribe((commant) => {
      console.log(commant)
      this.commants.push(commant)
    }, err => {
      console.log(err)
      this.toastController.create({
        position: "bottom", message: "connectoin problem", duration: 3000
      }).present()
    })
  }

  getUser() {
    this.authService.getCurrentUser()
      .then(user => {
        this.user = user
        if (this.user.favoriteCards) { this.checkFavorite() }
      })
      .catch(err => console.log("problem in auth"))
  }

  checkFavorite() {
    this.user.favoriteCards.find((card) => {
      return card.key == this.card.key
    }) ? this.favorite = true : this.favorite = false
  }

  favorCard() {
    if (this.favorite) {
      this.firstMessage = "Removing card from favorites"
      this.secondMessage = "card succefully removed from favorites"
      this.user.favoriteCards.filter(card => card.key !== this.card.key)
    }
    else {
      this.firstMessage = "adding card to favorites"
      this.secondMessage = "card succefully added to favorites"
      if (!this.user.favoriteCards) { this.user.favoriteCards = [] }
      this.user.favoriteCards.push({ key: this.card.key, name: this.card.name })
    }
    let loader = this.loadingController.create({ content: this.firstMessage })
    loader.present().then(() => {
      this.dataService.updateUser(this.user).then(() => {
        this.favorite = !this.favorite
        this.toastController.create({
          position: "bottom", message: this.secondMessage, duration: 3000
        }).present()
        loader.dismiss().catch((err) => console.log(err))
      })
    }).catch((err) => {
      this.toastController.create({
        position: "bottom", message: "error adding/removing card from favorites", duration: 3000
      }).present()
      loader.dismiss().catch((err) => console.log(err))
      console.log(err)
    })
  }

  ngOnDestroy() {
    this.commantSubscription.unsubscribe()
  }

  createComment() {
    this.navCtrl.push(CreateCommantPage, this.card)
  }

}
