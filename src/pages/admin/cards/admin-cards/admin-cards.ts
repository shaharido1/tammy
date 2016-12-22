import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/data.service'
import { RegisterUserToCardPage, CreateOrUpdateCardPage } from './../../../pages'

@Component({
  selector: 'admin-cards',
  templateUrl: 'admin-cards.html'
})
export class AdminCardsPage {
  allcards = [{name: "id"}, {name: "ita"}]

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) {debugger }

  ionViewDidLoad() {
    debugger
    let loader = this.loadingController.create({
      content: "loading class list"
    })
    loader.present(
      this.dataService.getAllpossibleCards()
        .subscribe((res) => {
          this.allcards = res
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }


  goToRegisterUsersToCard(card) {
    this.navCtrl.push(RegisterUserToCardPage, card)
  }

  createCard() {
    this.navCtrl.push(CreateOrUpdateCardPage)
  }

  deleteClassList() {
  //   let confirm = this.alertController.create({
  //     title: 'remove all?',
  //     message: 'Are you sure you want to remove all classes from the list?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.dataService.deleteAllCards().then(() => {
  //             this.toastController.create({
  //               message: 'You have delted the entire list',
  //               duration: 2000,
  //               position: 'bottom'
  //             }).present()
  //           }).catch(() => {
  //             this.toastController.create({
  //               message: 'operation faild',
  //               duration: 2000,
  //               position: 'bottom'
  //             }).present()
  //           })
  //         }
  //       },
  //       { text: 'No' }
  //     ]
  //   });
  //   confirm.present();
  // }
}
}
