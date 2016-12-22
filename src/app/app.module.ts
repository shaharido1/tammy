import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2'
import {LoginPage, SignUpPage, TabsPage, CardsPage, ProfilePage} from './../pages/pages';
import {firebaseConfig, DefulatfireBaseAuthAnonConfig} from './firebase.config';
import { FormsModule } from '@angular/forms';
import {DataService, AuthService} from './../shared/providers'


@NgModule({
  declarations: [
    MyApp, LoginPage, SignUpPage, TabsPage, CardsPage, ProfilePage

  ],
  imports: [
    IonicModule.forRoot(MyApp), 
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, DefulatfireBaseAuthAnonConfig)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, LoginPage, SignUpPage, TabsPage, CardsPage, ProfilePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
