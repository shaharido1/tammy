import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/data.service'

@Component({
  selector: 'page-register-user-to-card',
  templateUrl: 'register-user-to-card.html'
})
export class RegisterUserToCardPage {
  card: any;
  allUsers: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ionViewDidLoad() {
    this.card = this.navParams.data
    let loader = this.loadingController.create({
      content: "loading class list"
    })
    loader.present(
      this.dataService.getAllUsers()
        .subscribe((res) => {
          this.allUsers = res
          this.mapcardsForTuggole()
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }
 
 editCard() {
 }
 mapcardsForTuggole() {
    this.allUsers.map(user => {
      user.checked = false;
      if (this.card.users) {
        for (let i = 0; i < this.card.users.length; i++) {
          if (this.card.users[i].uid == user.$key) {
            user.checked = true;
            break
          }
        }
      }
    })
  }


}

