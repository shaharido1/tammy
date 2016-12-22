import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ICard, categories} from './../../../../shared/interfaces'
import { FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

@Component({
  selector: 'page-create-or-update-card',
  templateUrl: 'create-or-update-card.html'
})
export class CreateOrUpdateCardPage {
  createOrUpdaeCardForm: FormGroup;
  
  card : ICard = {AllocatedUsers: [], 
                  category: categories.CATEGORYA , 
                  commants: [], 
                  description: "", 
                  title: "", 
                  UrlToFile:""}


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    if (this.navParams.data.name) {
      this.card = this.navParams.data
  }

}
}
