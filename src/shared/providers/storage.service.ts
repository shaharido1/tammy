import { Injectable, Inject } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DataService } from './providers'
declare var firebase: any;

@Injectable()
export class StorageService {
    dataService : DataService
    constructor( @Inject(DataService) dataService: DataService) {
        this.dataService = dataService
    }

}
