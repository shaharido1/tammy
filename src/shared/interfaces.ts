
export interface IUser {
    name: String;
    surname: String;
    userid : String;
    School: Schools;
    email: String;
    phone: String;
    Allocatedcards: Array<IRefCard>;
    counterComments: Number;
    commants: Array<IComments>
}

export enum Schools {
    SCHOOLA, SCHOOLB, SCHOOLC
}

export interface IRefCard {
    title : String
    key : String
}

export interface IRefUser {
    userid : String
    key : String
}

export interface IComments {
    key? : String
    userDetails? : IRefUser
    cardDetails? : IRefCard
    title : String
    contnet : String
}

export interface ICard {
    title : String;
    category : categories;
    description : String;
    UrlToFile : String
    AllocatedUsers : Array<IRefUser>
    commants : Array<IComments>

}

export enum categories {
    CATEGORYA, CATEGORYB, CATEGORYC
}
