import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { DataService, AuthService } from './../shared/providers/providers'
import { LoginPage, TabsPage, AdminCardsListPage, AboutPage, SchoolListPage, AdminUsersListPage, AllcardsListPage } from './../pages/pages';
import {EventsTypes} from './../shared/interfaces'
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  admin: boolean = false;
  adminPages: Array<{ title: string, component: any, icon: string }>;
  userPages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform,
    public authService: AuthService,
    public dataService: DataService,
    public menu: MenuController, public events : Events
  ) {
    this.initializeApp();

    this.userPages = [
      { title: 'home', component: TabsPage, icon: 'home' },
      { title: 'all cards', component: AllcardsListPage, icon: 'school' },
      { title: 'about', component: AboutPage, icon: 'information-circle' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {
    //later will verifay admin//
    this.rootPage = LoginPage
    this.authService.getCurrentUser().then((user)=>{
      this.events.publish(EventsTypes.userConnected, user)
      this.adminPages = [];
      this.adminPages.push({ title: "manage cards", component: AdminCardsListPage, icon: 'albums' },
        { title: "manage schools", component: SchoolListPage, icon: 'book' },
        { title: "manage users", component: AdminUsersListPage, icon: 'people' })
      this.admin = true;
      this.menu.close()
      this.rootPage = TabsPage
    })
    .catch(err=> console.log(err + "err in loging")) 
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  signout() {
    this.authService.logOutUser()
    this.menu.close()
    this.nav.setRoot(LoginPage)
  }
}
