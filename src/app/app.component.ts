import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { DataService, AuthService } from './../shared/providers/providers'
import { LoginPage, TabsPage, AdminCardsPage, AboutPage, SchoolListPage, UsersListPage, AllUserCardsPage } from './../pages/pages';

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
    public menu: MenuController
  ) {
    this.initializeApp();

    this.userPages = [
      { title: 'home', component: TabsPage, icon: 'home' },
      { title: 'all cards', component: AllUserCardsPage, icon: 'school' },
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
    if (this.authService.getUser()) {
      this.adminPages = [];
      this.adminPages.push({ title: "manage cards", component: AdminCardsPage, icon: 'albums' },
        { title: "manage schools", component: SchoolListPage, icon: 'book' },
        { title: "manage users", component: UsersListPage, icon: 'people' })
      this.admin = true;
      this.menu.close()
      this.rootPage = TabsPage
    }
    else {
      this.rootPage = LoginPage
    }
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
