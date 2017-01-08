import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Shorten pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'shorten'
})
@Injectable()
export class Shorten {
  transform(value, limit : string) : string {
  return value.length>limit? value.substring(0, limit) + "COUNTINUE..." : value;
  }
}
