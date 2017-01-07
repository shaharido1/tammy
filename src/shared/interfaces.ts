
export class IUser {
    key: string; //this is the Uid from the auth 
    firstName: string;
    lastName: string;
    username: string; 
    school: ISchool;
    email: string;
    phone: string;
    allocatedCards?: Array<IRefCard> 
    counterComments?: Number
    commants?: Array<ICommantRef>
    fullName: string;
    favoriteCards? : Array<IRefCard>
    votes? : Array<ICommantRef>
    img? : string
}

export interface ISchool {
    key: string
    name : string
}

export interface ICommantRef {
    key: string
    title : string
}

export interface IRefCard {
    key: string
    name: string
    category : string
}

export interface IRefUser {
    key: string 
    fullName: string

}

export interface IComment {
    votes? : Array<IRefUser>,
    votesCounter? : number,
    key?: string
    userDetails?: IRefUser
    img? : string
    cardDetails?: IRefCard
    title: string
    contnet: string
    date : string;
}

export interface ICard {
    key: string
    name: string;
    category: string;
    urlToFile: string
    allocatedUsers: Array<IRefUser>
    commants: Array<ICommantRef>
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
    commants: "commants",
    admins: "admins",
    votes: "votes"
}

export const EventsTypes = {
    firebaseConnected : "firebaseConnected",
    firebaseDisconnected : "firebaseDisconnected",
    userConnected : "userConnected",
    userUpdated : "userUpdated",
    cardUpdated : "cardUpdated",
    userIsAdmin : "userIsAdmin"
}
