import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IThread, IComment } from '/interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    private databaseRef: any = firebase.database();
    private usersRef: any = firebase.database().ref('users');
    private threadsRef: any = firebase.database().ref('cards');
    private commentsRef: any = firebase.database().ref('comments');
    private storageRef: any = firebase.storage().ref()
    private connectionRef: any = firebase.database().ref('.info/connected');
    public connected: boolean = false;

    constructor() {
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

    getUsers() {
        this.usersRef.once
    }
}
