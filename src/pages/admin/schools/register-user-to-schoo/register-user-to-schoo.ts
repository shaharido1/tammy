import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DataService } from './../../../../shared/providers/providers'
import { ISchool } from './../../../../shared/interfaces'

@Component({
  selector: 'page-register-user-to-schoo',
  templateUrl: 'register-user-to-schoo.html'
})
export class RegisterUserToSchooPage implements OnInit{
  allUsers
  school : ISchool
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
  public dataService: DataService){}


  ngOnInit() {
    this.school = this.navParams.data
  }
}
