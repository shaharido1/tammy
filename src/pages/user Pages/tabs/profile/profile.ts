import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { IUser } from './../../../../shared/interfaces'
import { AuthService, DataService } from './../../../../shared/providers/providers'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  userDataLoaded: boolean = false;
  user: IUser
  loader: Loading
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
        this.authService.getCurrentUser()
          .then((user) => {
            this.userDataLoaded = true
            debugger
            this.user = user
            this.loader.dismiss().catch(() => console.log("problem in dismissing"))
          })
          .catch(err => console.log(err))
      })

  }
  openImageOptions() { }
  reload() { }
  showComant() {}


}
