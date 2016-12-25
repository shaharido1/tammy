import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {DataService} from './../../../../shared/providers/providers'
import {userDetailPage} from './../../../pages'

@Component({
  selector: 'page-user-list',
  templateUrl: 'users-list.html'
})
export class UsersListPage implements OnInit {
  userList : any;
  filterUserList: any
  queryText: string = ""
  
  constructor(public navCtrl: NavController, 
              public dataService : DataService,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private alertController: AlertController) {}

  ngOnInit(){
    let loader = this.loadingController.create({
      content: "loading users list"
    })
    loader.present(
      this.dataService.getAllUsers()
        .subscribe((res) => {
          console.log(res)
          this.userList = res
          this.filterUserList = this.userList
        },
        (err) => {
          console.log(err)
        }))
    loader.dismiss()
  }

  searchList() {
     this.filterUserList = this.userList.filter((user) => {
       if (!this.queryText || user.$key.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
              return user
      })
  }
  
  editClass($event, user) {
    this.navCtrl.push(userDetailPage, user)
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
            this.dataService.removeAllSchools().then(() => {
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

