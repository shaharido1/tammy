import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import {Paths} from './../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {
    connectionRef: any
    schools: FirebaseListObservable<any>
    categories: FirebaseListObservable<any>
    public connected: boolean = false;

    constructor(public angularFire: AngularFire) {
        console.log("entered service constructor")
        this.connectionRef = this.angularFire.database.object(Paths.infoConnected)
        this.schools = this.angularFire.database.list(Paths.schools)
        this.categories = this.angularFire.database.list(Paths.categories)
        try {
            this.checkFirebaseConnection();
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
///////////////////////////////////////users////////////////////////////////////
    getAllUsers() {
        return this.angularFire.database.list(Paths.users)
    }

    //sign up/add new user -> from the auth service//

    updateUser(user) : firebase.Promise<any>{
        return this.angularFire.database.list(Paths.users).update(user.$key, user)
    }

///////////////////////////////////cards////////////////////////////////////////////////////
    getAllCards() {
        return this.angularFire.database.list(Paths.cards)
    }

    getCardsOfUser(userID: any) {
        return this.angularFire.database.list(Paths.cards)
    }

    deleteAllCards() {
        return this.angularFire.database.list(Paths.cards).remove()
    }

    updateCard(cardToUpdate): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schools.update(cardToUpdate.$key, {
                name: cardToUpdate.name,
            })
                .then(() => resolve("success"))
                .catch(err => reject(err))
        })
    }

    saveNewCard(cardToSave) {
        return new Promise((resolve, reject) => {
            this.angularFire.database.list(Paths.cards).map(scl => {
                debugger
                console.log(scl)
                //if (card.name == schoolToSave) {
                //    reject("same name")
                //}
            })

            this.angularFire.database.list(Paths.cards)
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
            this.angularFire.database.object(`${Paths.schools}/ ${schoolToSave.$key}`).set({flag : true})
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
