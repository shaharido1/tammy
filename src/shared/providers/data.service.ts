import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef, FirebaseAuthState } from 'angularfire2'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { Paths, IUser, IRefCard, IRefUser, ICard, ISchool, IComment, ICommantRef, EventsTypes } from './../interfaces';
import { MappingService } from './mapping.service'
import * as _ from 'lodash'
@Injectable()
export class DataService {
    connectionRef: any
    schools: FirebaseListObservable<any>
    categories: FirebaseListObservable<any>
    cards: FirebaseListObservable<any> //maybe can be removed in full version
    root: any
    usersRef: any
    user: IUser
    public connected: boolean = false;

    constructor(private angularFire: AngularFire, public events: Events) {
        console.log("entered data service")
        this.root = this.angularFire.database.object(Paths.root)
        this.connectionRef = this.angularFire.database.object(Paths.infoConnected)
        this.categories = this.angularFire.database.list(Paths.categories)
        this.cards = this.angularFire.database.list(Paths.cards)
        events.subscribe(EventsTypes.userConnected, (user) => {
            this.user = user
        })
        this.checkFirebaseConnection();
    }

    checkFirebaseConnection() {
        this.angularFire.database.object(Paths.infoConnected, { preserveSnapshot: true })
            .subscribe((snap) => {
                (snap.val() === true) ? this.events.publish(EventsTypes.firebaseConnected)
                    : this.events.publish(EventsTypes.firebaseDisconnected)
            }, (err) => {
                this.events.publish(EventsTypes.firebaseDisconnected)
                console.log("firebase disconnected" + err)
            })
    }

    ///////////////////////////////////////users////////////////////////////////////

    makeUserAdmin(user: IUser): firebase.Promise<void> {
        return this.angularFire.database.object(`${Paths.admins}/${user.key}`).update({ fullname: user.fullName })
    }
    removeAdmin(user: IUser): firebase.Promise<void> {
        return this.angularFire.database.object(`${Paths.admins}/${user.key}`).remove()
    }
    isAdmin(user: IUser): Promise<true> {
        return new Promise((reject, resolve) => {
            this.angularFire.database.object(`${Paths.admins}/${user.key}`).subscribe((res) => {
                if (res.fullname) { resolve(true) }
                else { resolve(false) }
            }, err=>reject(err))
        })
    }

    getUserByKey(key: string): Observable<IUser> {
        return this.angularFire.database.object(`${Paths.users}/${key}`).map(user =>
        { return MappingService.mapUserfromDbToApp(user) })
    }

    getAllUsers(): Observable<any> {
        return this.angularFire.database.list(Paths.users)
            .map((res) => {
                return res.map(user => {
                    return MappingService.mapUserfromDbToApp(user)
                })
            })
    }


    //sign up/add new user -> from the auth service//

    updateUser(user: IUser, oldCardAllocation?: Array<IRefCard>): Promise<any> {
        let upref = {}
        debugger
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


    deleteAllUsers(): Promise<any> {
        let upRef = {}
        let finish: boolean = false
        upRef[`${Paths.users}`] = null
        this.cards.subscribe((res) => {
            res.map((card) =>
                upRef[`${Paths.cards}/${card.key}/${Paths.allocatedUsers}`] = null
            )
        }, (err) => console.log(err), () => finish = true)

        if (finish) return (this.root.update(upRef))
    }

    ///////////////////////////////////cards////////////////////////////////////////////////////
    getAllCards(): Observable<any> {
        return this.angularFire.database.list(Paths.cards)
            .map((res) => {
                console.log("res" + res)
                return res.map(card => {
                    console.log("card" + card.$key)
                    return MappingService.mapCardfromDbToApp(card)
                })
            })
    }

    getListOfCards(alloctedCardsOrFavorite: boolean): Observable<ICard> {
        let listCards: Array<IRefCard> = alloctedCardsOrFavorite ? this.user.allocatedCards : this.user.favoriteCards
        
        return new Observable(observer => {
            listCards.map((lisCard) => {
                this.angularFire.database.object(`${Paths.cards}/${lisCard.key}`)
                    .subscribe((card) => {
                        
                        observer.next(MappingService.mapCardfromDbToApp(card))
                    }, err => observer.error(err))
            })
        })
    }

    getCardsOfUser(userID: any): FirebaseListObservable<ICard[]> {
        return this.angularFire.database.list(Paths.cards)
    }

    deleteAllCards(): firebase.Promise<any> {
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
        cardToSave.key = null
        return this.angularFire.database.list(`${Paths.cards}`).push(cardToSave)
    }

    ///////////////////////////schools//////////////////////////////////////////////////////////
    getAllSchools(): Observable<ISchool[]> {
        return this.angularFire.database.list(Paths.schools)
            .map((res) => {
                return res.map(school => {
                    return MappingService.mapSchoolfromDbToApp(school)
                })
            })
    }
    getAllschoolllls(): FirebaseListObservable<ISchool[]> {
        return this.angularFire.database.list(Paths.schools)
    }

    updateSchool(schoolToUpdate): firebase.Promise<void> {
        return this.angularFire.database.object(`${Paths.schools}/${schoolToUpdate.key}`)
            .set({ name: schoolToUpdate.name })
        ///to update everywhere in database................
    }

    saveNewSchool(schoolToSave: ISchool): firebase.Promise<any> {
        return this.angularFire.database.list(`${Paths.schools}`).push({ name: schoolToSave.name })
    }

    removeAllSchools(): firebase.Promise<any> {
        return this.angularFire.database.list(Paths.schools).remove()
    }

    ///////////////////////////categories//////////////////////////////////////////////////////////

    getAllCategories(): FirebaseListObservable<any> {
        return this.categories
    }
    ///////////////////////////////////commants////////////////////////////////////////////////////
    setNewCommant(commant: IComment): Promise<any> {
        
        return new Promise((resolve, reject) => {
            
            this.angularFire.database.list(Paths.commants).push(commant).then(
                (data) => {
                    debugger
                    
                    console.log(data.path.o[1])
                    let commantkey: string = data.path.o[1]
                    let upref = {}
                    upref[`${Paths.cards}/${commant.cardDetails.key}/${Paths.commants}/${commantkey}`] = { title: commant.title }
                    upref[`${Paths.users}/${commant.userDetails.key}/${Paths.commants}/${commantkey}`] = { title: commant.title }
                    this.root.update(upref).then((res) => resolve()).catch((err) => reject(err))
                }).catch((err) => reject(err))
        })
    }

    getCommantsByList(cardCommants: Array<ICommantRef>): Observable<IComment> {
        return new Observable(observer => {
            if (cardCommants) {
                
                cardCommants.map((commant) => {
                    this.angularFire.database.object(`${Paths.commants}/${commant.key}`)
                        .subscribe(responseCommant => {
                            observer.next(responseCommant)
                        }, err => observer.error(err)
                        )
                })
            }
            else observer.next()
        })
    }
}

    // private checkIfExists(key: string): Promise<any> {
    //     let prom = new Promise((reject, resolve) => {
    //         let check = this.angularFire.database.object(`${Paths.cards}/${key}`).subscribe((res) => {
    //             if (res) {
    //                 console.log(res)
    //                 if (res.$exists()) {
    //                     
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
