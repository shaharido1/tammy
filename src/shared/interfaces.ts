
export interface IUser {
    name: String;
    surname: String;
    userid: String;
    School: Schools;
    email: String;
    phone: String;
    Allocatedcards: Array<IRefCard>;
    counterComments: Number;
    commants: Array<IComments>
}

export interface Schools {
    $key: string
}

export interface IRefCard {
    title: String
    key: String
}

export interface IRefUser {
    userid: String
    key: String
}

export interface IComments {
    key?: String
    userDetails?: IRefUser
    cardDetails?: IRefCard
    title: String
    contnet: String
}

export interface ICard {
    title: String;
    category: categories;
    UrlToFile: String
    AllocatedUsers: Array<IRefUser>
    commants: Array<IComments>
    $key?: string
}

export enum categories {
    CATEGORYA, CATEGORYB, CATEGORYC
}

export class FileItem {

    public file: File;
    public url: string = '';
    public isUploading: boolean = false;
    public progress: number = 0;

    public constructor(file: File) {
        this.file = file;
    }
}

export class ErrorMesseges {
    public static premissonDenied: string = "Error: PERMISSION_DENIED: Permission denied"
    public static emailAlreadyExist: string = "emailAlreadyExist"
}
