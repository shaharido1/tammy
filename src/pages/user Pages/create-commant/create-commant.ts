import { Component } from '@angular/core';
import { Events, NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DataService, AuthService } from './../../../shared/providers/providers'
import { ICard, IUser, IComment, EventsTypes } from './../../../shared/interfaces'
import { CardDetailsPage } from './../../pages'
@Component({
  selector: 'page-create-commant',
  templateUrl: 'create-commant.html'
})
export class CreateCommantPage {


  createCommentForm: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  card: ICard
  user: IUser
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
    this.createCommentForm = this.fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'content': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
    this.title = this.createCommentForm.controls['title'];
    this.content = this.createCommentForm.controls['content'];
  }

  getUser() {
    this.authService.getCurrentUser()
      .then(user => this.user = user)
      .catch(err => console.log("problem in auth"))
  }

  cancelNewComment() {
    console.log("cancel")
    this.nav.pop()
  }

  onSubmit(commentForm: any): void {
    if (this.user) {
      let loader = this.loadingCtrl.create({
        content: 'Posting comment...',
      });
      loader.present().then(() => {
        let newComment: IComment = {
          title: commentForm.title,
          contnet: commentForm.content,
          userDetails: { key: this.user.key, fullName: this.user.fullName },
          cardDetails: { key: this.card.key, name: this.card.name, category: this.card.category },
          img: this.user.img ? this.user.img : null,
          date: new Date().toString()
        };
        this.dataService.setNewCommant(newComment)
          .then(() => {
            loader.dismiss()
              .then(() => {
                this.events.publish(EventsTypes.commentCreated)
                this.nav.pop()
              })
              .catch((err) => console.log(err))
          })
          .catch((err) => {
            console.log(err + "err creating commant")
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