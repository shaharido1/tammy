import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/data.service'
import { RegisterUserToCardPage, CreateOrUpdateCardPage } from './../../../pages'
import {ICard} from './../../../../shared/interfaces'
@Component({
  selector: 'admin-cards',
  templateUrl: 'admin-cards.html'
})
export class AdminCardsPage implements OnInit {
  allCardsList : Array<ICard>
  filterCardsList : Array<ICard>
  queryText: string = ""

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    let loader = this.loadingController.create({
      content: "loading cards list"
    })
    loader.present(
      this.dataService.getAllCards()
        .subscribe((res) => {
          this.allCardsList = res
          this.filterCardsList = this.allCardsList
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }

  searchList() {
     this.filterCardsList = this.allCardsList.filter((card) => {
       if (!this.queryText || card.name.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
              return card
      })
  }

  editCard(card) {
    this.navCtrl.push(CreateOrUpdateCardPage, card)
  }

  createCard() {
    this.navCtrl.push(CreateOrUpdateCardPage)
  }

  deleteClassList() {
    let confirm = this.alertController.create({
      title: 'remove all?',
      message: 'Are you sure you want to remove all cards from the list?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dataService.deleteAllCards().then(() => {
              this.toastController.create({
                message: 'You have delted the entire list',
                duration: 2000,
                position: 'bottom'
              }).present()
            }).catch(() => {
              this.toastController.create({
                message: 'operation faild',
                duration: 2000,
                position: 'bottom'
              }).present()
            })
          }
        },
        { text: 'No' }
      ]
    });
    confirm.present();
  }

}
