import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, NavParams, ToastController, LoadingController, Events, Loading } from 'ionic-angular';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, ITopic, EventsTypes, IRefCard, IRefComment, IComment, IComentToShow, ITopicToShow } from './../../../shared/interfaces'
import { CreateTopicPage } from './../../pages'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/forkJoin'
import { Observable } from 'rxjs/Observable';

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
  isShowVideo: boolean
  cardRef: IRefCard;
  card: any
  cardToShow: boolean = false;
  topics: Array<any> = []

  commentSubscription: Subscription
  topicSubscription: Subscription
  favorite: boolean = false;
  user: any
  firstMessage: string
  secondMessage: string
  loader: Loading
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public dataService: DataService,
    public authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController, public events: Events,
    private AlertController: AlertController) {
    this.cardRef = this.navParams.data
    this.events.subscribe(EventsTypes.topicCreated, () => {
      this.topics = []
      this.ngOnInit()
    })
  }

  ngOnInit() {
    console.log("oninit")
    this.loader = this.loadingController.create({
      content: 'gettin card info...',
    });
    this.loader.present().then(() => {
      //forkjoin works only with completed observable
      //promis.all work only with promises.. 
      this.authService.getCurrentUser().subscribe((user) => {
        this.user = user
        this.dataService.getCardByKey(this.cardRef.key).then((card) => {
          this.card = card
          this.cardToShow = true
          this.checkFavorite()
          if (this.card.topics[0].key) {
            this.getTopics()
              .then(() => {
                this.loader.dismiss().catch(() => console.log("error in dismissing"))
              })
          }
          else {
            this.loader.dismiss().catch(() => console.log("error in dismissing"))
          }
        }).catch(() => this.loader.dismiss().catch(() => console.log("error in dismissing")))
      }, err => this.loader.dismiss().catch(() => console.log("error in dismissing")))
    })
  }
  


///////////////initializing///////////
checkFavorite() {
  this.user.favoriteCards.find((card) => {
    return card.key == this.card.key
  }) ? this.favorite = true : this.favorite = false
}

getTopics(): Promise < any > {
  return new Promise((resolve, reject) => {
    this.topicSubscription = this.dataService.gettopicsByList(this.card.topics)
      .subscribe(topic => {
        let topicToShow: ITopicToShow = Object.assign(topic)
        console.log(topicToShow)
        //init all the show/hide fields for each topic
        topicToShow.newComment = ""
        topicToShow.IscommentSection = false;
        topicToShow.isShowFullTopicContent = false
        topicToShow.isLiked = (topic.likes.find(user => this.user.key == user.key)) ? true : false
        topicToShow.fullNameString = ""
        this.topics.push(topicToShow)
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

///////////////top right buttons = favor card and create topic///////////
createTopic() {
  this.navCtrl.push(CreateTopicPage, this.card)
}
favorCard() {
  if (this.favorite) {
    this.firstMessage = "Removing card from favorites"
    this.secondMessage = "card succefully removed from favorites"
    this.user.favoriteCards = this.user.favoriteCards.filter(card => card.key !== this.card.key)
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
///////////////topic methods///////////

showAllLikes(topicOrComment) {
  debugger
  let listOfUser: string = ""
  if (topicOrComment.likes.length > 0) {
    topicOrComment.likes.map(user => {
      listOfUser = listOfUser.concat(user.fullName, "\ ")
    })
  }
  else { listOfUser = "no other users" }
  let allLikes = this.AlertController.create({
    title: 'all like',
    message: listOfUser,
    buttons: [
      { text: 'ok' }
    ]
  });
}
showFullTopicContent(topic) { topic.isShowFullTopicContent = !topic.isShowFullTopicContent }
profilePick() { console.log("profile tapp") }
likeTopic(topic) {
  if (this.topicSubscription) {this.topicSubscription.unsubscribe()}
  this.loader = this.loadingController.create({
    content: 'working..',
  });
  this.loader.present().then(() => {
    topic.isLiked = !topic.isLiked
    this.dataService.likeTopic(this.user, topic, topic.isLiked)
      .then(() => {
        debugger
        this.events.publish(EventsTypes.userUpdated)
        this.loader.dismiss().catch(() => console.log("error in dismissing"))
      })
      .catch((err) => {
        console.log(err)
        this.loader.dismiss().catch(() => console.log("error in dismissing"))
      })
  })
}

showCommentSection(topic: ITopicToShow) {
  if (topic.IscommentSection) {
    topic.IscommentSection = false
  }
  else {
    if (topic.comments.length > 1) {
      this.getComments(topic)
    }
    topic.IscommentSection = true
  }
}

///////////////comments methods///////////

getComments(topic: ITopicToShow) {
  this.loader = this.loadingController.create({
    content: 'getting Comments..',
  });
  topic.commentsToShow = []
  debugger
  this.loader.present().then(() => {
    debugger
    if (this.commentSubscription) { this.commentSubscription.unsubscribe() }
    this.commentSubscription = this.dataService.getCommentOfList(topic.comments).subscribe((com) => {
      let comToShow: IComentToShow = Object.assign(com)
      comToShow.isShowFullCommentContent = false
      comToShow.isLiked = (comToShow.likes.find(user => this.user.key == user.key)) ? true : false
      topic.commentsToShow.push(com)
      console.log(com)
      this.loader.dismiss().catch((err) => console.log("error in dismiss1" + err))
    }, err => {
      debugger
      this.loader.dismiss().catch(() => console.log("error in dismiss2"))
    })
  }).catch(() => {
    debugger
    this.loader.dismiss().catch(() => console.log("error in dismiss3"))
  })
}

showFullcommentContent(comment: IComentToShow) { comment.isShowFullCommentContent = !comment.isShowFullCommentContent }
likeComment(comment) {

  if (this.commentSubscription) { this.commentSubscription.unsubscribe() }
  this.loader = this.loadingController.create({
    content: 'working..',
  });
  this.loader.present().then(() => {
    comment.isLiked = !comment.isLiked
    this.dataService.likeComment(this.user, comment, comment.isLiked)
      .then(() => {
        this.events.publish(EventsTypes.userUpdated)
        this.loader.dismiss().catch(() => console.log("error in dismissing"))
      })
      .catch((err) => {
        console.log(err)
        this.loader.dismiss().catch(() => console.log("error in dismissing"))
      })
  })
}


addComment(topic: ITopicToShow) {
  let commentToSet: IComment = {
    topicDetails: { key: topic.key, title: topic.title },
    cardDetails: { name: this.card.name, key: this.card.key, category: this.card.category },
    userDetails: { fullName: this.user.fullName, key: this.user.key, img: this.user.img },
    content: topic.newComment,
    date: new Date().toString()
  }
  this.loader = this.loadingController.create({
    content: 'posting Comment..',
  });
  this.loader.present().then(() => {
    this.dataService.addComment(commentToSet).then((commentkey) => {
      this.events.publish(EventsTypes.userUpdated)
      commentToSet.key = commentkey
      if (!topic.commentsToShow) { topic.commentsToShow = [] }
      topic.commentsToShow.push(commentToSet)
      topic.newComment = ""
      this.loader.dismiss().then(() => {
      })
    })
  }).catch(() => this.loader.dismiss())
}

refreshAll(refresher) {
  refresher.complete()
  this.topics = []
  this.ngOnInit()
}

ngOnDestroy() {
  console.log("unsubscribe from topic list")
  if (this.topicSubscription) { this.topicSubscription.unsubscribe() }
  this.loader.dismiss()
}

showVideo() {
  this.isShowVideo = !this.isShowVideo
}

}
