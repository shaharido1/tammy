import { Component, OnInit, OnDestroy } from '@angular/core';
import { Events, NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, ITopic, EventsTypes } from './../../../shared/interfaces'
import { CardDetailsPage } from './../../pages'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'page-create-topic',
  templateUrl: 'create-topic.html'
})
export class CreateTopicPage implements OnInit, OnDestroy {


  createTopicForm: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  card: ICard
  user: IUser
  subscription: Subscription

  constructor(public nav: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public dataService: DataService,
    public toastController: ToastController,
    public events: Events) {

  }
  ngOnInit() {
    this.card = this.navParams.data
    this.getUser()
    this.createTopicForm = this.fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'content': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    this.title = this.createTopicForm.controls['title'];
    this.content = this.createTopicForm.controls['content'];
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  getUser() {
    this.subscription = this.authService.getCurrentUser()
      .subscribe(
        user => this.user = user
      ,err => console.log("problem in auth"))
  }

  onSubmit(topicForm: any): void {
    if (this.user) {
      let loader = this.loadingCtrl.create({
        content: 'Posting topic...',
      });
      loader.present().then(() => {
        let newTopic: ITopic = {
          title: topicForm.title,
          content: topicForm.content,
          userDetails: { key: this.user.key, fullName: this.user.fullName, img: this.user.img},
          cardDetails: { key: this.card.key, name: this.card.name, category: this.card.category },
          img: this.user.img ? this.user.img : null,
          date: new Date().toString()
        };
        this.dataService.setNewtopic(newTopic)
          .then(() => {
            loader.dismiss()
              .then(() => {
                this.events.publish(EventsTypes.topicCreated)
                this.events.publish(EventsTypes.userUpdated)
                this.nav.pop()
              })
              .catch((err) => console.log(err))
          })
          .catch((err) => {
            console.log(err + "err creating topic")
            loader.dismiss().catch(err => console.log(err))
          })
      })
    }
    else {
      this.toastController.create({
        position: "bottom", message: "connectoin problem, try again", duration: 3000
      }).present()
      this.getUser()
    }
  }
}