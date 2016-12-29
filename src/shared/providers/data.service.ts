import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/isEmpty';
import { Observable } from 'rxjs/Observable';
import { Paths, IUser, IRefCard, IRefUser, ICard, ISchool } from './../interfaces';
import { MappingService } from './mapping.service'
import * as _ from 'lodash'
@Injectable()
export class DataService {
    connectionRef: any
    schools: FirebaseListObservable<any>
    categories: FirebaseListObservable<any>
    cards : FirebaseListObservable<any> //maybe can be removed in full version
    root: any
    usersRef: any
    public connected: boolean = false;

    constructor(private angularFire: AngularFire) {
        console.log("entered data service")
        this.root = this.angularFire.database.object(Paths.root)
        this.connectionRef = this.angularFire.database.object(Paths.infoConnected)
        this.categories = this.angularFire.database.list(Paths.categories)
        this.cards = this.angularFire.database.list(Paths.cards)
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
    getAllUsers(): Observable<any> {
        return this.angularFire.database.list(Paths.users)
            .map((res) => {
                return res.map(user => {
                    return MappingService.mapUserfromDbToApp(user)
                })
            })
    }

    //sign up/add new user -> from the auth service//

    updateUser(user: IUser, oldCardAllocation?: Array<IRefCard>): firebase.Promise<any> {
        let upref = {}
        let userToSet = MappingService.mapUserfromAppToDb(user)
        upref[`${Paths.users}/${user.key}`] = userToSet
        if (typeof oldCardAllocation !== 'undefined') {
            Object.assign(upref, this.updateCardUserList(user, oldCardAllocation))
        }
        return this.root.update(upref)
    }


    private updateCardUserList(user: IUser, oldCardAllocation): Object {
        let upRef = {}
        _.differenceBy(oldCardAllocation, user.allocatedCards, "key")
            .map((cardToRemoveUser) => {
                upRef[`${Paths.cards}/${cardToRemoveUser.key}/${Paths.allocatedUsers}/${user.key}`] = null
            })
        _.differenceBy(user.allocatedCards, oldCardAllocation, "key")
            .map((cardToAddUser) => {
                upRef[`${Paths.cards}/${cardToAddUser.key}/${Paths.allocatedUsers}/${user.key}`] = { fullname: user.fullName }
            })
        return upRef
    }



    //set() -> destructive update, oppose to update()


    deleteAllUsers(): firebase.Promise<any> {
        let upRef = {}
        let finish : boolean = false
        upRef[`${Paths.users}`] = null
        this.cards.subscribe( (res) => {
            res.map( (card) =>
            upRef[`${Paths.cards}/${card.key}/${Paths.allocatedUsers}`] = null
             )
        }, (err)=> console.log(err), () => finish =true )

        if (finish) return (this.root.update(upRef))
    }

    ///////////////////////////////////cards////////////////////////////////////////////////////
    getAllCards(): Observable<any> {
        return this.angularFire.database.list(Paths.cards)
            .map((res) => {
                return res.map(card => {
                return MappingService.mapCardfromDbToApp(card)
                })
            })
    }
    getCardsOfUser(userID: any) {
        return this.angularFire.database.list(Paths.cards)
    }

    deleteAllCards() {
        return this.angularFire.database.list(Paths.cards).remove()
    }

    updateCard(card: ICard, oldUserAllocation?: Array<IRefUser>): firebase.Promise<any> {
        let upref = {}
        let cardToSet = MappingService.mapCardfromAppToDb(card)
        upref[`${Paths.cards}/${card.key}`] = cardToSet
        if (typeof oldUserAllocation !== 'undefined') {
            Object.assign(upref, this.updateUserCardList(card, oldUserAllocation))
        }
        return this.root.update(upref)
    }

    private updateUserCardList(card: ICard, oldCardAllocation): Object {
        let upRef = {}
        _.differenceBy(oldCardAllocation, card.allocatedUsers, "key")
            .map((userToRemoveUser) => {
                upRef[`${Paths.users}/${userToRemoveUser.key}/${Paths.allocatedCards}/${card.key}`] = null
            })
        _.differenceBy(card.allocatedUsers, oldCardAllocation, "key")
            .map((cardToAddUser) => {
                upRef[`${Paths.users}/${cardToAddUser.key}/${Paths.allocatedCards}/${card.key}`] = { card: card.name }
            })
        return upRef
    }

    saveNewCard(cardToSave: ICard): firebase.Promise<void> {
        cardToSave.key=null
        return this.angularFire.database.list(`${Paths.cards}`).push(cardToSave)
    }

    ///////////////////////////schools//////////////////////////////////////////////////////////
    getAllSchools(): Observable<any> {
        return this.angularFire.database.list(Paths.schools)
            .map((res) => {
                return res.map(school => {
                return MappingService.mapSchoolfromDbToApp(school)
                })
            })
    }

    updateSchool(schoolToUpdate) : firebase.Promise<void> {
        return this.angularFire.database.object(`${Paths.schools}/${schoolToUpdate.key}`)
              .set({name: schoolToUpdate.name})
    }

    saveNewSchool(schoolToSave: ISchool): firebase.Promise<any> {
        return this.angularFire.database.list(`${Paths.schools}`).push({ name: schoolToSave.name })
    }

    removeAllSchools(): firebase.Promise<any> {
        return this.angularFire.database.list(Paths.schools).remove()
    }

    ///////////////////////////categories//////////////////////////////////////////////////////////

    getAllCategories() {
        return this.categories


    }

}




    // private checkIfExists(key: string): Promise<any> {
    //     let prom = new Promise((reject, resolve) => {
    //         let check = this.angularFire.database.object(`${Paths.cards}/${key}`).subscribe((res) => {
    //             if (res) {
    //                 console.log(res)
    //                 if (res.$exists()) {
    //                     debugger
    //                     console.log("title already exists")
    //                     reject("title already exists")
    //                 }
    //                 else {
    //                     console.log("title don't exists")
    //                     resolve()
    //                 }
    //             }
    //         })
    //     })
    // }