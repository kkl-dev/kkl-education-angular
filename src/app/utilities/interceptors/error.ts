
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

   public handleError(error : Error) {
    console.error(error)
    console.error(error.message)
  }
}
