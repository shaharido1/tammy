
export class IUser {
    key: string; //this is the Uid from the auth 
    firstName: string;
    lastName: string;
    username: string; 
    school: ISchool;
    email: string;
    phone: string;
    allocatedCards?: Array<IRefCard> 
    counterTopics?: Number
    ownTopics?: Array<IRefTopic>
    likedTopics?: Array<IRefTopic>
    ownComments? : Array<IRefComment>
    likedComments? : Array<IRefComment>
    fullName: string;
    favoriteCards? : Array<IRefCard>
    img? : string
}

export interface ISchool {
    key: string
    name : string
}
export interface Icategories {
    name: string
}
export interface IRefTopic {
    key: string
    title : string
}


export interface IRefCard {
    key: string
    name: string
    category : string
}

export interface IRefComment {
    key : string,
    content : string
}


export interface IRefUser {
    key: string 
    fullName: string
    img? : string

}

export interface ITopic {
    likes? : Array<IRefUser>
    likeCounter? : number
    key?: string
    userDetails?: IRefUser
    img? : string
    cardDetails?: IRefCard
    title: string
    content: string
    date : string;
    comments? : Array<IRefComment>
    commentCounter? : number
}

export interface ITopicToShow extends ITopic {
    IsShowAllLikes : boolean
    isShowFullTopicContent : boolean
    IscommentSection : boolean
    isLiked : boolean
    fullNameString : string
    newComment : string
    commentsToShow? : Array<IComment>
}
export interface IComentToShow extends IComment {
    IsShowAllLikes : boolean
    isShowFullCommentContent : boolean
    isLiked : boolean
    fullNameString : string
}
export interface IComment {
    key?: string
    userDetails: IRefUser
    cardDetails : IRefCard
    topicDetails: IRefTopic
    content: string
    date : string;
    likes? : Array<IRefUser>,
    likesCounter? : number,
}

export interface ICard {
    key: string
    name: string;
    category: string;
    urlToFile: string
    allocatedUsers: Array<IRefUser>
    topics: Array<IRefTopic>
}


export class ErrorMesseges {
    public static premissonDenied: string = "Error: PERMISSION_DENIED: Permission denied"
    public static emailAlreadyExist: string = "Error: The email address is already in use by another account."
    
}

import {databaseRootUrl} from './../app/firebase.config'
export const Paths = {
    root: databaseRootUrl,
    users: "users",
    cards: "cards",
    schools: "schools",
    categories:"categories",
    infoConnected: ".info/connected",
    allocatedUsers:"allocatedUsers",
    allocatedCards: "allocatedCards",
    topics: "topics",
    admins: "admins",
    likes: "likes",
    likedTopics : "likedTopics",
    ownTopics : "ownTopics",
    ownComments : "ownComments",
    comments : "comments",
    likedComments : "likedComments"
}

export const EventsTypes = {
    firebaseConnected : "firebaseConnected",
    firebaseDisconnected : "firebaseDisconnected",
    networkConnected: "networkConnected",
    networkDisconnected: "networkDisconnected",
    userUpdated : "userUpdated",
    userConnected : "userConnected",
    userDisconnected : "userDisconnected",
    cardUpdated : "cardUpdated",
    userIsAdmin : "userIsAdmin",
    topicCreated: "topicCreated"
}

export const storageKeys = {
    categories : "categories",
    user : "user",
    auth : "auth"
}