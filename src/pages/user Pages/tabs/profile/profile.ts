import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { IUser } from './../../../../shared/interfaces'
import { AuthService, DataService } from './../../../../shared/providers/providers'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit, OnDestroy {
  userDataLoaded: boolean = false;
  user: IUser
  loader: Loading
  subscription: Subscription

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public dataService : DataService, 
    public loadingController: LoadingController) { }

  ngOnInit() {
    this.loader = this.loadingController.create({
      content: 'gettin user info...',
    });
    this.loader.present()
      .then(() => {
        this.subscription=this.authService.getCurrentUser()
          .subscribe((user) => {
            debugger
            this.userDataLoaded = true
            this.user = user
            this.loader.dismiss().catch(() => console.log("problem in dismissing"))
          }, err => console.log(err))
      })
  }
  ngOnDestroy(){
    if (this.subscription) {this.subscription.unsubscribe()}
  }
  goToComment(comment) {}
  goToTopic(topic){}
  openImageOptions() { }
  reload() { }
  showComant() {}


}
