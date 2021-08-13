
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

   public handleError(error : any) {
     console.log(2)
    console.error(error)
    console.error(error.stack)
  }
}
