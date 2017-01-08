import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2'
import {firebaseConfig, DefulatfireBaseAuthAnonConfig} from './firebase.config';
import {LoginPage, SignUpPage, TabsPage, AllcardsListPage, 
        ProfilePage, AdminCardDetailsPage, 
        AboutPage, AdminCardsListPage, SchoolListPage, 
        SchoolDetailPage, AdminUserDetailsPage, AdminUsersListPage,
        FavoritesCardsPage, CardDetailsPage, CreateCommantPage} from './../pages/pages';
import {DataService, AuthService, StorageService, Shorten} from './../shared/providers/providers'
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp, 
    LoginPage, 
    SignUpPage, 
    TabsPage, 
    ProfilePage, 
    AboutPage, 
    SchoolListPage, 
    SchoolDetailPage,
    AdminCardDetailsPage,
    AdminCardsListPage,
    AdminUserDetailsPage,
    AdminUsersListPage,
    AllcardsListPage,
    FavoritesCardsPage,
    CardDetailsPage,
    CreateCommantPage,
    Shorten

  ],
  imports: [
    IonicModule.forRoot(MyApp), 
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, DefulatfireBaseAuthAnonConfig)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, LoginPage, SignUpPage, TabsPage, ProfilePage,
    AboutPage,  SchoolListPage, SchoolDetailPage, AdminCardDetailsPage,
    AdminCardsListPage, AdminUserDetailsPage, AdminUsersListPage,
    AllcardsListPage, FavoritesCardsPage, CardDetailsPage, CreateCommantPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, DataService, AuthService, StorageService]
})
export class AppModule {}
