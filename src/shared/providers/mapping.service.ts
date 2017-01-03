import { Injectable } from '@angular/core';
import { IUser, Paths, IRefUser, IRefCard, ISchool, ICard, IComment, ICommantRef } from './../interfaces'

export class MappingService {

    static mapUserfromDbToApp(user): IUser {
        let userToSet: IUser;
        if (user.allocatedCards) {

        }
        userToSet = {
            allocatedCards: user.allocatedCards ? MappingService.arrangeCardsToArray(user.allocatedCards) : [],
            commants: user.commants ? user.commants : [],
            counterComments: user.counterComments ? user.counterComments : 0,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            school: user.school,
            username: user.username,
            fullName: user.firstName + user.lastName,
            key: user.$key //this is the Uid from the auth      
        }
        return userToSet
    }
    private static arrangeCardsToArray(allocatedCards): Array<IRefCard> {
        let cardArray: Array<IRefCard> = []
        Object.keys(allocatedCards).forEach(ky => {
            cardArray.push({ key: ky, name: allocatedCards[ky].name })
        })
        return cardArray
    }

    static mapUserfromAppToDb(user: IUser) {
        let cardObj = {}
        user.allocatedCards.map(card => {
            cardObj[card.key] = { name: card.name }
        })
        let userToSet = {}
        Object.assign(userToSet, user)
        userToSet["key"] = null
        userToSet["allocatedCards"] = cardObj
        return userToSet
    }

    static mapCardfromAppToDb(card: ICard) {
        let userObj = {}
        card.allocatedUsers.map(user => {
            userObj[user.key] = { fullName: user.fullName }
        })
        let cardToSet = {}
        Object.assign(cardToSet, card)
        cardToSet["key"] = null
        cardToSet["allocatedUsers"] = userObj
        return cardToSet
    }



    static mapSchoolfromDbToApp(school): ISchool {
        return ({ key: school.$key, name: school.name    })
    }

    static mapCardfromDbToApp(card): ICard {
        return ({
            key: card.$key,
            name: card.name,
            allocatedUsers: card.allocatedUsers ? MappingService.arrangeUsersToArray(card.allocatedUsers) : [],
            category: card.category,
            commants: card.commants ? card.commants : [],
            urlToFile: card.urlToFile ? card.urlToFile : ""
        })

    }
    private static arrangeUsersToArray(allocatedUsers): Array<IRefUser> {
        let userArray: Array<IRefUser> = []
        Object.keys(allocatedUsers).forEach(ky => {
            userArray.push({ key: ky, fullName: allocatedUsers[ky].fullName })
        })
        return userArray
    }



    static userRefToCard(user: IUser): IRefUser {
        return ({ key: user.key, fullName: user.fullName })
    }

    static mapCommantFromDbToApp(commant): IComment {
        return ({
            cardDetails: commant.cardDetails,
            contnet: commant.contnet,
            date: commant.date,
            key: commant.$key,
            title: commant.title,
            userDetails: commant.userDetails
        })
    }

}