import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

import { IThread, IComment } from '/interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    connectionRef: any
    schools: FirebaseListObservable<any>
    categories: FirebaseListObservable<any>
    public connected: boolean = false;

    constructor(public angularFire: AngularFire) {
        this.connectionRef = this.angularFire.database.object('.info/connected')
        this.schools = this.angularFire.database.list('schools')
        this.categories = this.angularFire.database.list('categories')
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
        catch (error) {
            console.log('Firebase: No connection:' + error);
            this.connected = false;
        }
    }
    ///////////////////////users///////////////////////////
    /////////////get/////////////
    getAllUsers() {
        return this.angularFire.database.list('users')
    }
    ///////////set///////////////
    addNewUser(user) {
        return this.angularFire.database.list('users').push(user)
    }

    //////////////////////////////////cards////////////////////////////////////////////////////
    getAllCards() {
        debugger
        return this.angularFire.database.list('cards')
    }

    getCardsOfUser(userID: any) {
        return this.angularFire.database.list('cards')
    }

    deleteAllCards() {
        return this.angularFire.database.list('cards').remove()
    }


    saveCardImage(cardID, cardurl) {
        return this.angularFire.database.object(`cards\ ${cardID}`).set({ cardURL: cardurl })
    }

    updateCard(cardToUpdate): Promise<any> {
        return new Promise((resolve, reject) => {
            debugger
            this.angularFire.database.list('cards').map(card => {
                debugger
                console.log(card)
                //if (card.title == cardToUpdate && scl.$key!=cardToUpdate.$key) {
                //cardsct("same name"cards           }
            })
            this.schools.update(cardToUpdate.$key, {
                name: cardToUpdate.name,
            })
                .then(() => resolve("success"))
                .catch(err => reject(err))
        })
    }

    saveNewCard(cardToSave) {
        return new Promise((resolve, reject) => {
            this.angularFire.database.list('cards').map(scl => {
                debugger
                console.log(scl)
                //if (card.name == schoolToSave) {
                //    reject("same name")
                //}
            })

            this.angularFire.database.list('cards')
                .push(cardToSave)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }


    ///////////////////////////schools//////////////////////////////////////////////////////////
    getAllSchools(): FirebaseListObservable<any> {
        return this.schools
    }

    updateSchool(schoolToUpdate): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.schools.subscribe(res => res.map((scl) => {
            //     if (scl.name == schoolToUpdate && scl.$key != schoolToUpdate.$key)
            //         reject("same name")
            // }))
            this.schools.update(schoolToUpdate.$key, {
                $key: schoolToUpdate.$key,
            })
                .then(() => resolve("success"))
                .catch(err => reject(err))
        })
    }

    saveNewSchool(schoolToSave) {
        return new Promise((resolve, reject) => {
            this.angularFire.database.object(`schools/${schoolToSave.$key}`).set({flag : true})
                .then(() => resolve())
                .catch(err => reject(err))
        })
    }

    removeAllSchools(): firebase.Promise<any> {
        return this.schools.remove()
    }

    ///////////////////////////schools//////////////////////////////////////////////////////////

    getAllCategories() {
        return this.categories


    }

}
