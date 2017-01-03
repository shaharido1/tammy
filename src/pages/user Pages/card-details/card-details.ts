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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataService,
    public authService : AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController, public events: Events) {
    this.card = this.navParams.data
  }

  ngOnInit() {
    this.getUser()
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

  favorCard() {
    let loader = this.loadingController.create({ content: "saving card to favorite" })
    loader.present().then(() => {
      if (!this.user.favoriteCards) this.user.favoriteCards=[]
      this.user.favoriteCards.push({ key: this.card.key, name: this.card.name })
      this.dataService.updateUser(this.user).then(() => {
        this.favorite = true
        this.toastController.create({
          position: "bottom", message: "card saved to favorite", duration: 3000
        }).present()
        loader.dismiss().catch((err) => console.log(err))
      })
    }).catch((err) => console.log(err))
  }

  checkFavorite() {
    for (let i = 0; i < this.user.favoriteCards.length; i++) {
      if (this.user.favoriteCards[i].key == this.card.key) {
        this.favorite == true
        break
      }
    }
  }

  ngOnDestroy() {
    this.commants = []
    this.commantSubscription.unsubscribe()
  }


  createComment() {
    this.commantSubscription.unsubscribe()
    this.commants = []
    this.navCtrl.push(CreateCommantPage, this.card)
  }

}
