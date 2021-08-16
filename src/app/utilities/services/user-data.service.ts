import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  user = {
    urlPrefix: 'education', // change to education
    name: 'יוסי',
    lastName: 'שאולי',
    imgSrc: 'assets/images/userImage.jpg',
  };

  componentType = {


    education: {


      dashboardScreen: {
        navbarComponent:'steps',
      }}
  };

  constructor() {}
}
