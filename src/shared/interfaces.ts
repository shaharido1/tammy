
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
    commants?: Array<IComments>
    fullName: string;
}

export interface ISchool {
    key: string
    name : string
}

export interface IRefCard {
    key: string
    name: string
}

export interface IRefUser {
    key: string 
    fullName: string

}

export interface IComments {
    key?: string
    userDetails?: IRefUser
    cardDetails?: IRefCard
    name: string
    contnet: string
}

export interface ICard {
    key: string
    name: string;
    category: categories;
    urlToFile: string
    allocatedUsers: Array<IRefUser>
    commants: Array<IComments>
}

export interface categories {
    key : string
    name : string
}

export class ErrorMesseges {
    public static premissonDenied: string = "Error: PERMISSION_DENIED: Permission denied"
    public static emailAlreadyExist: string = "Error: The email address is already in use by another account."
    
}

import {databaseRootUrl} from './../app/firebase.config'
export class Paths {
    public static root: string = databaseRootUrl
    public static users: string = "users"
    public static cards: string = "cards"
    public static schools: string = "schools"
    public static categories: string ="categories"
    public static infoConnected: string = ".info/connected"
    public static allocatedUsers: string ="allocatedUsers"
    public static allocatedCards: string = "allocatedCards"
}
