import {Component, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';
import {CardsPage, ProfilePage} from './../pages'
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('forumTabs') tabRef: Tabs;
    public cardsPage: any;
    public profilePage: any;

    constructor(public navCtrl: NavController, 
        public events: Events) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.cardsPage = CardsPage;
        this.profilePage = ProfilePage;
    }

}