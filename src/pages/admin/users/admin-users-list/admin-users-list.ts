import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { AdminUserDetailsPage } from './../../../pages'
import { IUser } from './../../.../../../../shared/interfaces'
import * as _ from 'lodash'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'page-user-list',
  templateUrl: 'admin-users-list.html'
})
export class AdminUsersListPage implements OnInit, OnDestroy {
  allUsers: Array<any>
  categorizedUsers: Array<any>
  displayUsers: Array<IUser>
  queryText: string = ""
  subscription: Subscription


  constructor(public navCtrl: NavController,
    public dataService: DataService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    let loader = this.loadingController.create({
      content: "loading cards list",
    })
    loader.present().then(() => {
      this.subscription = this.dataService.getAllUsers()
        .subscribe((res) => {
          this.allUsers = res
          this.sortUsers()
          loader.dismiss().catch(() => console.log("error in dismissing"))
        })
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    console.log("unsubscribed from getAllCards")
  }

  sortUsers() {
    this.categorizedUsers =
      _.chain(this.allUsers)
        //for each team in array
        .filter(user => {
          if (!this.queryText || user.fullName.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
            return user
        })
        //groupby (array, function/string) -> if string, looking for the same value 
        .groupBy('school')
        //create pairs of key and value 
        .toPairs()
        //zip -> _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
        //=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
        .map(item => _.zipObject(['schoolName', 'schoolUsers'], item))
        //unwrap the chain value
        .value();
    this.displayUsers = this.categorizedUsers
  }

  goToUserDetails($event, user) {
    this.navCtrl.push(AdminUserDetailsPage, user)
  }


  refreshAll(refresher) {
    refresher.complete()
    this.ngOnInit()
  }

  deleteUserList() {
    let confirm = this.alertController.create({
      title: 'remove all?',
      message: 'Are you sure you want to remove all users from the dataBase?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dataService.deleteAllUsers().then(() => {
              this.toastController.create({
                message: 'You have deleted the entire user list',
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

