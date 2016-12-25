import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2'
import {firebaseConfig, DefulatfireBaseAuthAnonConfig} from './firebase.config';
import {LoginPage, SignUpPage, TabsPage, CardsPage, 
        ProfilePage, RegisterUserToCardPage, AdminCardsPage, 
        AboutPage, CreateOrUpdateCardPage, SchoolListPage, SchoolDetailPage} from './../pages/pages';
import {DataService, AuthService, StorageService} from './../shared/providers/providers'


@NgModule({
  declarations: [
    MyApp, 
    LoginPage, 
    SignUpPage, 
    TabsPage, 
    CardsPage, 
    ProfilePage, 
    RegisterUserToCardPage, 
    AdminCardsPage, 
    AboutPage, 
    CreateOrUpdateCardPage,
    SchoolListPage, 
    SchoolDetailPage

  ],
  imports: [
    IonicModule.forRoot(MyApp), 
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, DefulatfireBaseAuthAnonConfig)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, LoginPage, SignUpPage, TabsPage, CardsPage, 
    ProfilePage, RegisterUserToCardPage, AdminCardsPage, 
    AboutPage, CreateOrUpdateCardPage, SchoolListPage, SchoolDetailPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DataService, AuthService, StorageService]
})
export class AppModule {}
