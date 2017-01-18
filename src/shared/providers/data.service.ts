import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseRef, FirebaseAuthState } from 'angularfire2'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { Paths, IUser, IRefCard, IRefUser, ICard, ISchool, ITopic, IRefComment, Icategories, EventsTypes, storageKeys, IComment, IRefTopic } from './../interfaces';
import { MappingService } from './mapping.service'
import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription'

declare var firebase: any;

@Injectable()
export class DataService {
    connectionRef: any
    schools: FirebaseListObservable<any>
    categories: Array<{ name: string }>
    cards: FirebaseListObservable<any> //maybe can be removed in full version
    root: any
    usersRef: any
    user: IUser
    public connected: boolean = false;

    constructor(private angularFire: AngularFire, public events: Events, public storage: Storage) {
        this.initialaizeService()
        console.log("entered data service")
        this.root = this.angularFire.database.object(Paths.root)
        this.connectionRef = this.angularFire.database.object(Paths.infoConnected)
        this.events.subscribe(EventsTypes.userConnected, () => {
            this.storage.get(storageKeys.user)
                .then((user) => { this.user = user })
                .catch(() => this.events.publish(EventsTypes.userUpdated))
        })
    }

    initialaizeService() {
        this.checkFirebaseConnection();
        this.getCategories()
    }

    goOffline() { firebase.database().goOffline() }
    goOnline() { firebase.database().goOnline() }

    makeSureUserIsnotNull() {
        if (!this.user) {
            this.storage.get(storageKeys.user)
                .then((user) => { this.user = user })
                .catch(() => this.events.publish(EventsTypes.userUpdated))
        }
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



    getUserByKey(key: string): Observable<IUser> {
        return new Observable(observer => {
            this.angularFire.database.object(`${Paths.users}/${key}`).subscribe(user =>
            { observer.next(MappingService.mapUserfromDbToApp(user)) })
        })
    }

    getAllUsers(): Observable<IUser[]> {
        return new Observable(observer => {
            this.angularFire.database.list(Paths.users)
                .subscribe((res) => {
                    console.log("response from server" + res)
                    observer.next(
                        res.map(user => {
                            console.log("get all cards - this user:" + user.$key)
                            return (MappingService.mapUserfromDbToApp(user))
                        })
                    )
                }, err => observer.error(err))
        })
    }



    //sign up/add new user -> from the auth service//

    updateUser(user: IUser, oldCardAllocation?: Array<IRefCard>): Promise<any> {
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


    deleteAllUsers(): Promise<any> {
        let upRef = {}
        let finish: boolean = false
        upRef[`${Paths.users}`] = null
        this.angularFire.database.list(Paths.cards).subscribe((res) => {
            res.map((card) =>
                upRef[`${Paths.cards}/${card.key}/${Paths.allocatedUsers}`] = null
            )
        }, (err) => console.log(err), () => finish = true)

        if (finish) return (this.root.update(upRef))
    }

    ///////////////////////////////////cards////////////////////////////////////////////////////
    getAllCards(): Observable<ICard[]> {
        return new Observable(observer => {
            this.angularFire.database.list(Paths.cards)
                .subscribe((res) => {
                    console.log("response from server" + res)
                    observer.next(
                        res.map(card => {
                            console.log("get all cards - this card:" + card.$key)
                            return (MappingService.mapCardfromDbToApp(card))
                        })
                    )
                }, err => observer.error(err))
        })
    }
    //not in use
    private getListOfCards(alloctedCardsOrFavorite: boolean): Observable<ICard> {
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

    getCardByKey(cardKey: string): Promise<ICard> {
        debugger
        return new Promise((resolve, reject) => {
            this.angularFire.database.object(`${Paths.cards}/${cardKey}`).subscribe(card => {
                resolve(MappingService.mapCardfromDbToApp(card))
            }, err => reject(err))
        })
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
                upRef[`${Paths.users}/${cardToAddUser.key}/${Paths.allocatedCards}/${card.key}`] = { name: card.name, category: card.category }
            })
        return upRef
    }

    saveNewCard(cardToSave: ICard): firebase.Promise<void> {
        cardToSave.key = null
        return this.angularFire.database.list(`${Paths.cards}`).push(cardToSave)
    }

    ///////////////////////////schools//////////////////////////////////////////////////////////
    getAllSchools(): Observable<ISchool[]> {
        return new Observable(observer => {
            this.angularFire.database.list(Paths.schools)
                .subscribe((res) => {
                    res.map(school => {
                        observer.next(MappingService.mapSchoolfromDbToApp(school))
                    })
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

    getCategories(): Promise<Array<{ name: string }>> {
        return new Promise((resolve, reject) => {
            if (this.categories) { resolve(this.categories) }
            else {
                let subscription = this.angularFire.database.list(Paths.categories).subscribe((res) => {
                    subscription.unsubscribe()
                    this.categories = res
                    resolve(this.categories)
                }, err => reject(err))
            }
        })
    }

    get2Categories(): Promise<Array<{ name: string }>> {
        return new Promise((resolve, reject) => {
            let subscription: Subscription
            this.storage.get(storageKeys.categories)
                .then(categories => {
                    if (categories) resolve(categories)
                    else subscription = this.angularFire.database.list(Paths.categories).subscribe((res) => {
                        debugger
                        subscription.unsubscribe()
                        this.storage.set(storageKeys.categories, res).then((res) => {
                            resolve(res)
                        })
                    })
                }).catch(() => {
                    subscription = this.angularFire.database.list(Paths.categories).subscribe((res) => {
                        debugger
                        subscription.unsubscribe()
                        debugger
                        this.storage.set(storageKeys.categories, res)
                            .then((res) => {
                                resolve(res)
                            })
                            .catch(err => { reject(err); console.log("error in storage" + err) })
                    }, err => { reject(err); console.log("error in firebae" + err) })
                })
        })
    }

    ///////////////////////////////////comments////////////////////////////////////////////////////
    addComment(comment: IComment): Promise<any> {
        return new Promise((resolve, reject) => {
            this.angularFire.database.list(Paths.comments).push(comment)
                .then((data) => {
                    let commentkey: string = data.path.o[1]
                    let upref = {}
                    upref[`${Paths.users}/${comment.userDetails.key}/${Paths.ownComments}/${commentkey}`] =
                        { content: comment.content }
                    upref[`${Paths.topics}/${comment.topicDetails.key}/${Paths.comments}/${commentkey}`] =
                        { content: comment.content }
                    this.root.update(upref).then(() => resolve(commentkey))
                }).catch((err) => reject(err))
        })
    }
    getCommentOfList(ListOfComments: Array<IRefComment>): Observable<IComment> {
        return new Observable((observer) => {
            ListOfComments.map((com) => {
                let subscriptption = this.angularFire.database.object(`${Paths.comments}/${com.key}`).subscribe((fulComment) => {
                    observer.next(MappingService.mapCommentFromDbToApp(fulComment))
                    subscriptption.unsubscribe()
                }, err => observer.error(err))
            })
        })
    }

    likeComment(user, comment, isLiked): firebase.Promise<any> {
        let upref = {}
        upref[`${Paths.comments}/${comment.key}/${Paths.likes}/${user.key}`] = isLiked ? { fullName: user.fullName } : null
        upref[`${Paths.users}/${user.key}/${Paths.likedComments}/${comment.key}`] = isLiked ? { content: comment.content } : null
        return this.root.update(upref)
    }
    ///////////////////////////////////topics////////////////////////////////////////////////////

    likeTopic(user, topic, isLiked): firebase.Promise<any> {
        let upref = {}
        upref[`${Paths.topics}/${topic.key}/${Paths.likes}/${user.key}`] = isLiked ? { fullName: user.fullName } : null
        upref[`${Paths.users}/${user.key}/${Paths.likedTopics}/${topic.key}`] = isLiked ? { title: topic.title } : null
        return this.root.update(upref)
    }

    setNewtopic(topic : ITopic): Promise<any> {
        return new Promise((resolve, reject) => {
            this.angularFire.database.list(Paths.topics).push(topic).then(
                (data) => {
                    console.log(data.path.o[1])
                    let topickey: string = data.path.o[1]
                    let upref = {}
                    upref[`${Paths.cards}/${topic.cardDetails.key}/${Paths.topics}/${topickey}`] = { title: topic.title }
                    upref[`${Paths.users}/${topic.userDetails.key}/${Paths.ownTopics}/${topickey}`] = { title: topic.title }
                    this.root.update(upref).then((res) => resolve()).catch((err) => reject(err))
                }).catch((err) => reject(err))
        })
    }

    gettopicsByList(cardtopics: Array<IRefTopic>): Observable<ITopic> {
        return new Observable(observer => {
            cardtopics.map((topic) => {
                let subscription = this.angularFire.database.object(`${Paths.topics}/${topic.key}`)
                    .subscribe(responsetopic => {
                        observer.next(MappingService.maptopicFromDbToApp(responsetopic))
                        subscription.unsubscribe()
                    }, err => observer.error(err)
                    )
            })
        })
    }
    ///////////////////////////////comments////////////////////////////////////////////////////////

}
