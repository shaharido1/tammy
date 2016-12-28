import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AuthService} from './../../../shared/providers/auth.service'
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  user
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: AuthService) {}

  ionViewDidLoad() {

    console.log('ionViewDidLoad CardsPage');
    this.authService.getUser().subscribe((auth)=> {
    console.log(auth)
    this.user=auth}, (err)=> console.log(err))
  }

}
