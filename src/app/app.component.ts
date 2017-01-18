import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { Network, StatusBar, Splashscreen } from 'ionic-native';
import { EventsTypes, storageKeys } from './../shared/interfaces'
import { DataService, AuthService } from './../shared/providers/providers'
import { LoginPage, TabsPage, AdminCardsListPage, AboutPage, SchoolListPage, AdminUsersListPage, AllcardsListPage } from './../pages/pages';
import { Storage } from '@ionic/storage';

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
    public events: Events,
    public storage: Storage) {
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
    this.events.subscribe(EventsTypes.userIsAdmin, () => this.admin = true)

  }

  initializeApp() {
    //plugins are available.
    this.platform.ready().then(() => {
      //statusbar of phone battery, etc.
      StatusBar.styleDefault();
      //plashscreen - where the app is loded. change "resource", and config.xml
      Splashscreen.show();
      //monitor connection throught the app
      this.watchForConnection()
      this.watchForDisconnect();
      //our own sqlite service init
      //if you need to do platform specific things.. 
      //console.log('in ready..');
      //let array: string[] = platform.platforms();
      //console.log(array); 
    });
  }

  watchForConnection() {
    debugger
    Network.onConnect().subscribe(() => {
      debugger
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log('we got a connection..');
        console.log('Firebase: Go Online..');
        //let firebase service know we're online
        this.dataService.goOnline();
        //let all cmp now we are online
        this.events.publish(EventsTypes.networkConnected);
      }, 3000);
    });
  }

  watchForDisconnect() {
    // watch network for a disconnect
    Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('Firebase: Go Offline..');
      //self.sqliteService.resetDatabase();
      this.dataService.goOffline();
      this.events.publish(EventsTypes.networkDisconnected);
    });
  }

  ngOnInit() {
    var that = this
    let sub = this.authService.getCurrentUser().subscribe((user) => {
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
    }, err => {
    this.rootPage = LoginPage
    console.log(err + "err in loging")
  })
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  signout() {
    this.authService.logOutUser().then(() => {
      Promise.all([this.storage.remove(storageKeys.user), this.storage.remove(storageKeys.auth)])
        .then(() => {
           this.admin = false
          this.menu.close()
          this.nav.setRoot(LoginPage)

        })
         //this.events.publish(EventsTypes.userDisconnected)
    }).catch((err) => console.log(err))
  }
}
