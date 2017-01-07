import { Injectable } from '@angular/core';
import { IUser, Paths, IRefUser, IRefCard, ISchool, ICard, IComment, ICommantRef } from './../interfaces'

export class MappingService {

    ////////////////////////////user///////////////////////////////////////////////////////////////
    static mapUserfromDbToApp(user): IUser {
        let userToSet: IUser;
        if (user.allocatedCards) {

        }
        userToSet = {
            allocatedCards: user.allocatedCards ? MappingService.arrangeCardsToArray(user.allocatedCards) : [],
            commants: user.commants ? MappingService.arrangeCommantsToArray(user.commants) : [],
            counterComments: user.commants ? Object.keys(user.commants).length : 0,
            favoriteCards: user.favoriteCards ? MappingService.arrangeCardsToArray(user.favoriteCards) : [],
            votes: user.votes? MappingService.arrangeCommantsToArray(user.votes) : [],
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            school: user.school,
            username: user.username,
            fullName: user.firstName + " " + user.lastName,
            key: user.$key, //this is the Uid from the auth      
            img : user.img? user.img : ""
        }
        return userToSet
    }

    static mapUserfromAppToDb(user: IUser) {
        let userToSet = {}
        Object.assign(userToSet, user)
        userToSet["key"] = null
        userToSet["allocatedCards"] = MappingService.arrangeCardsToObject(user.allocatedCards)
        userToSet["favoriteCards"] = MappingService.arrangeCardsToObject(user.favoriteCards)
        userToSet["commants"]=MappingService.arragneCommantToObject(user.commants)
        return userToSet
    }
    ////////////////////////////cards///////////////////////////////////////////////////////////////

    static mapCardfromAppToDb(card: ICard) {

        let cardToSet = {}
        Object.assign(cardToSet, card)
        cardToSet["key"] = null
        cardToSet["allocatedUsers"] = MappingService.arrangeUsersToObject(card.allocatedUsers)
        cardToSet["commants"]=MappingService.arragneCommantToObject(card.commants)
        return cardToSet
    }

    static mapCardfromDbToApp(card): ICard {
        return ({
            key: card.$key,
            name: card.name,
            allocatedUsers: card.allocatedUsers ? MappingService.arrangeUsersToArray(card.allocatedUsers) : [],
            category: card.category,
            commants: card.commants ? MappingService.arrangeCommantsToArray(card.commants) : [],
            urlToFile: card.urlToFile ? card.urlToFile : ""
        })

    }

    ////////////////////////////commant///////////////////////////////////////////////////////////////

    static mapCommantFromDbToApp(commant): IComment {
        return ({
            cardDetails: commant.cardDetails,
            contnet: commant.contnet,
            date: commant.date,
            key: commant.$key,
            title: commant.title,
            userDetails: commant.userDetails,
            img : commant.img? commant.img : null,
            votes: commant.votes? commant.votes : [],
            votesCounter: commant.votes? Object.keys(commant.votes).length-1 : 0  
        })
    }
    ////////////////////////////school///////////////////////////////////////////////////////////////

    static mapSchoolfromDbToApp(school): ISchool {
        return ({ key: school.$key, name: school.name })
    }
    ////////////////////////////categories///////////////////////////////////////////////////////////////
    static mapCategoriesObjectIntoArray(categories) : Array<{name : string}> {
        let catArray : Array<{name : string}> =[]
        categories.
        Object.keys(categories).forEach(ky=>{
            catArray.push({name : ky})
        })
        return catArray
    }
    ////////////////////////////references///////////////////////////////////////////////////////////////
    /////////////users///////////
    private static arrangeUsersToArray(allocatedUsers): Array<IRefUser> {
        let userArray: Array<IRefUser> = []
        Object.keys(allocatedUsers).forEach(ky => {
            userArray.push({ key: ky, fullName: allocatedUsers[ky].fullName })
        })
        return userArray
    }
    private static arrangeUsersToObject(userArray: Array<IRefUser>): Object {
        let userObj = {}
        userArray.map(user => {
            userObj[user.key] = { fullName: user.fullName }
        })
        return userObj
    }
    
    static userRefToCard(user: IUser): IRefUser {
        return ({ key: user.key, fullName: user.fullName })
    }

    /////////////commant///////////
    private static arrangeCommantsToArray(commants): Array<ICommantRef> {
        let commantsArray: Array<ICommantRef> = []
        Object.keys(commants).forEach(ky => {
            commantsArray.push({ key: ky, title: commants[ky].title })
        })
        return commantsArray
    }

    private static arragneCommantToObject(commantArray: Array<ICommantRef>): Object {
        let commantObj = {}
        commantArray.map(commant => {
            commantObj[commant.key] = { title: commant.title }
        })
        return commantObj
    }

    

    ///////////cards array<>object///////////////////
    private static arrangeCardsToArray(allocatedCards): Array<IRefCard> {
        let cardArray: Array<IRefCard> = []
        Object.keys(allocatedCards).forEach(ky => {
            cardArray.push({key: ky, name: allocatedCards[ky].name, category: allocatedCards[ky].category})
        })
        return cardArray
    }

    private static arrangeCardsToObject(cardArray: Array<IRefCard>): Object {
        let cardObj = {}
        cardArray.map(card => {
            cardObj[card.key] = { name: card.name, category: card.category }
        })
        return cardObj
    }

}