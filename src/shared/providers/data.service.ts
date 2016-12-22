import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {auth} from 'firebase'
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import 'rxjs/add/operator/map';
import { IThread, IComment } from '/interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    connectionRef: any
    public connected: boolean = false;

    constructor(public angularFire: AngularFire) {
        this.connectionRef = this.angularFire.database.object('.info/connected')
        try {
            this.checkFirebaseConnection();
            /*
            self.storageRef.child('images/default/profile.png').getDownloadURL().then(function (url) {
                self.defaultImageUrl = url.split('?')[0] + '?alt=media';
            });
            */
            //hard code one thread
        } catch (error) {
            console.log('Firebase: No connection:' + error);
        }
    }

    checkFirebaseConnection() {
        try {
            this.connectionRef.on('value', function (snap) {
                console.log(snap.val());
                if (snap.val() === true) {
                    console.log('Firebase: Connected:');
                    this.connected = true;
                } else {
                    console.log('Firebase: No connection:');
                    this.connected = false;
                }
            });
        }
        catch (error) 
            {
                console.log('Firebase: No connection:' + error);
                this.connected = false;
            }
    }

    addNewUser(user){
       return this.angularFire.database.list('users').push(user)
    }

    getAllpossibleCards() {
         debugger
         return this.angularFire.database.list('cards')
    }
    
    getAllpossibleUsers() {
         return this.angularFire.database.list('users')
    }

    deleteAllCards() {
    return this.angularFire.database.list('cards').remove()
  }

  getCardsOfUser(){
      return this.angularFire.database.list('cards')
  }
}
