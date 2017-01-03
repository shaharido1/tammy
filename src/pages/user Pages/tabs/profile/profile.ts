import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {IUser} from './../../../../shared/interfaces'
import {AuthService } from './../../../../shared/providers/providers'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  userDataLoaded: boolean = true;
  user : IUser 
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService) {}

  ngOnInit(){
    this.authService.getCurrentUser()
      .then((user)=> this.user=user)
      .catch(err=> console.log(err))
  }
  
  openImageOptions(){}
  reload(){}


}
