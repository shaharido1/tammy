import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {IUser} from './../../../../shared/interfaces'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  userDataLoaded: boolean = true;
  user : IUser 
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  openImageOptions(){}
  reload(){}


}
