
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandler implements ErrorHandler {

  public handleError(error: Error) {
    console.error(error.message)
  }
}
