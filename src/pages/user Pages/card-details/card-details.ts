import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Events, Loading } from 'ionic-angular';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, IComment, EventsTypes, IRefCard } from './../../../shared/interfaces'
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
  isLiked: boolean;
  commantTapped: boolean
  cardRef: IRefCard;
  card: any
  cardToShow: boolean = false;
  commants: Array<any> = []
  show = false
  subscription: Subscription
  favorite: boolean = false;
  user: any
  firstMessage: string
  secondMessage: string
  loader: Loading
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController, public events: Events) {
    this.cardRef = this.navParams.data
    this.events.subscribe(EventsTypes.cardUpdated, () => {
      this.commants = []
      this.ngOnInit()
    })
  }


  ngOnInit() {
    console.log("oninit")

    this.loader = this.loadingController.create({
      content: 'gettin user info...',
    });
    this.loader.present().then(() => {
      Promise.all([
        this.dataService.getCardByKey(this.cardRef.key),
        this.authService.getCurrentUser()
      ]).then(values => {
        debugger
        console.log(values)
        this.card = values[0]
        this.cardToShow = true
        this.user = values[1]
        this.checkFavorite()
        if (this.card.commants[0].key) {
          this.getCommants()
            .then(() => {
              this.mapCommentForlikeAndFullShow()
              this.loader.dismiss().catch(() => console.log("error in dismissing"))
            })
            .catch(() => this.loader.dismiss().catch(() => console.log("error in dismissing"))
            )
        }
        else {
          this.loader.dismiss().catch(() => console.log("error in dismissing"))
        }
      }).catch(err => this.loader.dismiss())
    })
  }

  refreshAll(refresher) {
    refresher.complete()
    this.commants = []
    this.ngOnInit()
  }

  getCommants(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.dataService.getCommantsByList(this.card.commants)
        .subscribe(commant => {
          console.log(commant)
          this.commants.push(commant)
          resolve()
        }, err => {
          console.log(err)
          this.toastController.create({
            position: "bottom", message: "connectoin problem", duration: 3000
          }).present()
          reject(err)
        })
    })
  }

  mapCommentForlikeAndFullShow() {
    this.commants.map(commant => {
      commant.summary = true
      commant.isLiked = commant.votes[this.user.key] ? true : false
    })
  }

  showFullComment($event, commant) {
    debugger
    commant.summary = !commant.summary
    console.log("comment tap")
  }

  profilePick() { console.log("profile tapp") }

  like($event, commant) {
    this.subscription.unsubscribe()
    console.log($event)
    this.loader = this.loadingController.create({
      content: 'working..',
    });
    this.loader.present().then(() => {
      commant.isLiked = !commant.isLiked
      this.dataService.updateVote(this.user, commant, commant.isLiked)
        .then(() => {
          // this.commants = []
          // this.getCommants().then(() => {
          // this.mapCommentForlikeAndFullShow()
          commant.votesCounter = commant.isLiked? commant.votesCounter+1 : commant.votesCounter-1
          this.loader.dismiss().catch(() => console.log("error in dismissing"))
        })
        .catch((err) => {
          console.log(err)
          this.loader.dismiss().catch(() => console.log("error in dismissing"))
        })
    })
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
      this.user.favoriteCards = this.user.favoriteCards.filter(card => card.key !== this.card.key)
      debugger
    }
    else {
      this.firstMessage = "adding card to favorites"
      this.secondMessage = "card succefully added to favorites"
      if (!this.user.favoriteCards) { this.user.favoriteCards = [] }
      this.user.favoriteCards.push({ key: this.card.key, name: this.card.name, category: this.card.category })
    }
    let loader = this.loadingController.create({ content: this.firstMessage })
    loader.present().then(() => {
      this.dataService.updateUser(this.user).then(() => {
        this.favorite = !this.favorite
        this.events.publish(EventsTypes.userUpdated)
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
    console.log("unsubscribe from commant list")
    if (this.subscription) { this.subscription.unsubscribe() }
    this.loader.dismiss()
  }

  createComment() {
    this.navCtrl.push(CreateCommantPage, this.card)
  }

}
