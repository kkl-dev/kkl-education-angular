import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
//import {AuthService}  from '../security/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    //const isApiUrl= request.url.startsWith(environment.apiUrl) ;
    // if ( isApiUrl){
    //     request = request.clone({
    //         withCredentials: true
    //       });
    // }
    // headers: new HttpHeaders({'Accept': 'application/json'}) ,
    request= request.clone({
      withCredentials: true,    
      setHeaders:{
       'Accept': 'application/json',
      }
   })
   
    return next.handle(request);
  }
}