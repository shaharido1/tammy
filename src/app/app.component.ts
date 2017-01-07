import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {EventsTypes} from './../shared/interfaces'
import { DataService, AuthService } from './../shared/providers/providers'
import { LoginPage, TabsPage, AdminCardsListPage, AboutPage, SchoolListPage, AdminUsersListPage, AllcardsListPage } from './../pages/pages';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  admin: boolean = false
  rootPage: any;
  adminPages: Array<{ title: string, component: any, icon: string }>;
  userPages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform,
    public authService: AuthService,
    public dataService: DataService,
    public menu: MenuController,
    public events : Events
  ) {
    this.initializeApp();

    this.userPages = [
      { title: 'home', component: TabsPage, icon: 'home' },
      { title: 'all cards', component: AllcardsListPage, icon: 'school' },
      { title: 'about', component: AboutPage, icon: 'information-circle' }
    ];
    this.adminPages = [
      { title: "manage cards", component: AdminCardsListPage, icon: 'albums' },
      { title: "manage schools", component: SchoolListPage, icon: 'book' },
      { title: "manage users", component: AdminUsersListPage, icon: 'people' }
    ]
    this.events.subscribe(EventsTypes.userIsAdmin, ()=>this.admin=true)

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {
    var that=this//later will verifay admin//
    this.authService.getCurrentUser().then((user) => {
      if (user) {
        this.rootPage = TabsPage
        this.menu.close()
        this.authService.isAdmin(user)
          .then(isUserAdmin => {
            if (isUserAdmin) {
              console.log("the user is admin")
              this.events.publish(EventsTypes.userIsAdmin)
              that.admin = true
            }
          }).catch((err) => console.log(err + "error in admin identification proccess"))
      }
      else { this.rootPage = LoginPage }
    }).catch(err => console.log(err + "err in loging"))
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  signout() {
    this.authService.logOutUser().then(() => {
      this.admin = false
      this.menu.close()
      this.nav.setRoot(LoginPage)
    }).catch((err) => console.log(err))
  }
}
