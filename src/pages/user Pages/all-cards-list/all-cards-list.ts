import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { DataService } from './../../../shared/providers/data.service'
import { ICard } from './../../../shared/interfaces'
import * as _ from 'lodash'
import { CardDetailsPage } from './../../pages'

@Component({
  selector: 'page-all-user-cards',
  templateUrl: 'all-cards-list.html'
})

export class AllcardsListPage {
  allCards: Array<ICard> = []
  categorizedCards: Array<any>
  displayCards: Array<ICard>
  queryText: string = ""

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {

    this.allCards=[]
    this.dataService.getListOfCards(true)
      .subscribe((card) => {

        this.allCards.push(card)
        this.sortCards()
      },
      (err) => {
        console.log(err)
      })
  }


  sortCards() {
    this.categorizedCards =
      _.chain(this.allCards)
        //for each team in array
        .filter(card => {
          if (!this.queryText || card.name.toLocaleLowerCase().includes(this.queryText.toLocaleLowerCase()))
            return card
        })
        //groupby (array, function/string) -> if string, looking for the same value 
        .groupBy('category')
        //create pairs of key and value 
        .toPairs()
        //zip -> _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
        //=> [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
        .map(item => _.zipObject(['categoryName', 'categoryCards'], item))
        //unwrap the chain value
        .value();
    this.displayCards = this.categorizedCards
  }

  pushToCardDetails($event, card) {
    this.navCtrl.push(CardDetailsPage, card)
  }

}
