import { Injectable } from '@angular/core';
import { IUser, Paths, IRefUser, IRefCard, ISchool, ICard, ITopic, IRefTopic, IComment, IRefComment } from './../interfaces'

export class MappingService {

    ////////////////////////////user///////////////////////////////////////////////////////////////
    static mapUserfromDbToApp(user): IUser {
        let userToSet: IUser;
        if (user.allocatedCards) {

        }
        userToSet = {
            key: user.$key, //this is the Uid from the auth      
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            school: user.school,
            username: user.username,
            fullName: user.firstName + " " + user.lastName,
            img: user.img ? user.img : "",

            allocatedCards: user.allocatedCards ? MappingService.arrangeCardsToArray(user.allocatedCards) : [],
            favoriteCards: user.favoriteCards ? MappingService.arrangeCardsToArray(user.favoriteCards) : [],

            ownTopics: user.ownTopics ? MappingService.arranTitleNKeyToArray(user.ownTopics) : [],
            likedTopics: user.likedTopics ? MappingService.arranTitleNKeyToArray(user.likedTopics) : [],
            
            ownComments: user.ownComments ? MappingService.arrangeCommentsIntoArray(user.ownComments) : [],
            likedComments: user.likedComments ? MappingService.arrangeCommentsIntoArray(user.likedComments) : [],

        }
        return userToSet
    }

    static mapUserfromAppToDb(user: IUser) {
        let userToSet = {}
        Object.assign(userToSet, user)
        userToSet["key"] = null
        userToSet["allocatedCards"] = user.allocatedCards ? MappingService.arrangeCardsToObject(user.allocatedCards) : []
        userToSet["favoriteCards"] = user.favoriteCards ? MappingService.arrangeCardsToObject(user.favoriteCards) : []
        userToSet["ownTopics"] = user.ownTopics ? MappingService.arragneTitleNKeyinToObject(user.ownTopics) : []
        userToSet["likedTopics"] = user.likedTopics ? MappingService.arragneTitleNKeyinToObject(user.likedTopics) : []
        userToSet["ownComments"] = user.ownComments ? MappingService.arragneJustKeyIntoObject(user.ownComments) : []
        userToSet["likedComments"] = user.likedComments ? MappingService.arragneJustKeyIntoObject(user.likedComments) : []
        return userToSet
    }

    ////////////////////////////cards///////////////////////////////////////////////////////////////

    static mapCardfromAppToDb(card: ICard) {

        let cardToSet = {}
        Object.assign(cardToSet, card)
        cardToSet["key"] = null
        cardToSet["allocatedUsers"] = card.allocatedUsers ? MappingService.arrangeUsersToObject(card.allocatedUsers) : null
        cardToSet["topics"] = card.topics ? MappingService.arragneTitleNKeyinToObject(card.topics) : null
        return cardToSet
    }

    static mapCardfromDbToApp(card): ICard {
        return ({
            key: card.$key,
            name: card.name,
            allocatedUsers: card.allocatedUsers ? MappingService.arrangeUsersToArray(card.allocatedUsers) : [],
            category: card.category,
            topics: card.topics ? MappingService.arranTitleNKeyToArray(card.topics) : [],
            urlToFile: card.urlToFile ? card.urlToFile : ""
        })

    }

    ////////////////////////////topic///////////////////////////////////////////////////////////////

    static maptopicFromDbToApp(topic): ITopic {
        return ({
            cardDetails: topic.cardDetails,
            content: topic.content,
            date: topic.date,
            key: topic.$key,
            title: topic.title,
            userDetails: topic.userDetails,
            img: topic.img ? topic.img : null,

            comments: topic.comments ? MappingService.arrangeCommentsIntoArray(topic.comments) : [],
            commentCounter: topic.comments ? Object.keys(topic.comments).length : 0,

            likes: topic.likes ? MappingService.arrangeUsersToArray(topic.likes) : [],
            likeCounter: topic.likes ? Object.keys(topic.likes).length : 0,
        })
    }

    ////////////////////////////comment///////////////////////////////////////////////////////////////

    static mapCommentFromDbToApp (commentObject): IComment {
        return ({
                key: commentObject.$key,
                cardDetails : commentObject.cardDetails,
                topicDetails: commentObject.topicDetails,
                userDetails: commentObject.userDetails,
                content: commentObject.content,
                date: commentObject.date,
                likes: commentObject.likes ? MappingService.arrangeUsersToArray(commentObject.likes) : [],
                likesCounter: commentObject.likes ? Object.keys(commentObject.likes).length : 0,
        })
    }
    ////////////////////////////school///////////////////////////////////////////////////////////////

    static mapSchoolfromDbToApp(school): ISchool {
        return ({ key: school.$key, name: school.name })
    }

    ////////////////////////////categories///////////////////////////////////////////////////////////////
    static mapCategoriesObjectIntoArray(categories): Array<{ name: string }> {
        let catArray: Array<{ name: string }> = []
        categories.
            Object.keys(categories).forEach(ky => {
                catArray.push({ name: ky })
            })
        return catArray
    }
    ////////////////////////////references///////////////////////////////////////////////////////////////
    /////////////users///////////
    private static arrangeUsersToArray(allocatedUsers): Array<IRefUser> {
        let userArray: Array<IRefUser> = []
        Object.keys(allocatedUsers).forEach(ky => {
            userArray.push({ key: ky, fullName: allocatedUsers[ky].fullName, img: allocatedUsers[ky].img})
        })
        return userArray
    }

    private static arrangeUsersToObject(userArray: Array<IRefUser>): Object {
        let userObj = {}
        userArray.map(user => {
            userObj[user.key] = { fullName: user.fullName, img : user.img }
        })
        return userObj
    }

    /////////////topic///////////
    private static arranTitleNKeyToArray(topics): Array<IRefTopic> {
        let topicsArray: Array<IRefTopic> = []
        Object.keys(topics).forEach(ky => {
            topicsArray.push({ key: ky, title: topics[ky].title })
        })
        return topicsArray
    }

    private static arragneTitleNKeyinToObject(topicArray: Array<IRefTopic>): Object {
        debugger
        let topicObj = {}
        topicArray.map(topic => {
            topicObj[topic.key] = { title: topic.title }
        })
        return topicObj
    }

    private static arragneJustKeyIntoObject(comments: Array<IRefComment>): Object {
        debugger
        let commentObj = {}
        comments.map(com => {
            commentObj[com.key] = {content : com.content}
        })
        return commentObj
    }

    private static arrangeCommentsIntoArray(comments): Array<IRefComment> {
        let commentsArray: Array<IRefComment> = []
        Object.keys(comments).forEach(ky => {
            commentsArray.push({key: ky, content: comments[ky].content})
        })
        return commentsArray
    }



    ///////////cards array<>object///////////////////
    private static arrangeCardsToArray(allocatedCards): Array<IRefCard> {
        let cardArray: Array<IRefCard> = []
        Object.keys(allocatedCards).forEach(ky => {
            cardArray.push({ key: ky, name: allocatedCards[ky].name, category: allocatedCards[ky].category })
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