import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {DataService, AuthService} from './../shared/providers/providers'
import {LoginPage, SignUpPage, TabsPage} from './../pages/pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public authService :AuthService,
              public menu: MenuController
             ) {
    this.initializeApp();

    this.pages = [
      { title: 'Page Two', component: "Page2" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {
    debugger
    if (this.authService.isSignedIn) {
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
