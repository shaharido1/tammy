import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { AdminUserDetailsPage } from './../../../pages'
import { IUser } from './../../.../../../../shared/interfaces'
import * as _ from 'lodash'

@Component({
  selector: 'page-user-list',
  templateUrl: 'admin-users-list.html'
})
export class AdminUsersListPage implements OnInit {
  allUsers: Array<any>
  categorizedUsers: Array<any>
  displayUsers: Array<IUser>
  queryText: string = ""


  constructor(public navCtrl: NavController,
    public dataService: DataService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.dataService.getAllUsers()
      .subscribe((res) => {
        this.allUsers = res
        this.sortUsers()
      })
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
    this.ngOnInit()
    refresher.complete();
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

