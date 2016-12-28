import { Injectable, Inject } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DataService } from './providers'
declare var firebase: any;

@Injectable()
export class StorageService {
    dataService
    constructor( @Inject(DataService) dataService: DataService) {
        this.dataService = dataService
    }

    uploadCardImage(file: any, cardID: any) {
        //
        let storageRef = firebase.storage().ref()
        file.isUploading = true;
        let uploadTask: firebase.storage.UploadTask = storageRef.child(`IMAGES_FOLDER}/${file.name}`).put(file);
        //
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => file.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            (error) => { },
            () => {
                file.url = uploadTask.snapshot.downloadURL;
                file.isUploading = false;
                this.dataService.saveCardImage(cardID, file.url)
                    .then(() => console.log())
                    .catech(() => console.log())
            }
        );
    }
}
