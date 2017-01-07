import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { SchoolDetailPage } from './../../../pages'
import { ISchool } from './../../../../shared/interfaces'
import { Observable } from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription.d'
import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-school-list',
  templateUrl: 'school-list.html'
})
export class SchoolListPage implements OnInit, OnDestroy {
  schoolList: Array<ISchool>;
  filterSchoolList: Array<ISchool>
  queryText: string = ""
  subscription : Subscription
  constructor(public navCtrl: NavController,
    public dataService: DataService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.subscription= this.dataService.getAllSchools()
      .subscribe((res) => {
        console.log(res)
        this.schoolList = res
        this.filterSchoolList = this.schoolList
      }, (err) => {
        console.log(err)
      })
  }
  ngOnDestroy() {
    console.log("unsubscribed from school list")
    this.subscription.unsubscribe()
  }

  searchList() {
    this.filterSchoolList = this.schoolList.filter((scl) => {
      if (!this.queryText || scl.key.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
        return scl
    })
  }

  editClass($event, scl) {
    this.navCtrl.push(SchoolDetailPage, scl)
  }
  pushToSchoolDetailPage() {
    this.navCtrl.push(SchoolDetailPage)
  }
  refreshAll(refresher) {
    refresher.complete()
    this.ngOnInit()
  }

  deleteClassList() {
    let confirm = this.alertController.create({
      title: 'remove all?',
      message: 'Are you sure you want to remove all schools from the list?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dataService.removeAllSchools().then(() => {
              this.toastController.create({
                message: 'You have deleted the entire school list',
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
