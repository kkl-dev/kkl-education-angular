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
        // backgroundImage:
        //   'url(../../../assets/images/education-table-background.jpg)',
      //   iconsArray: [
      //     {
      //       svgUrl: 'assets/images/05-destination.svg',
      //       name: 'הטיולים שלי',
      //       url: 'search',
      //     },
      //     {
      //       svgUrl: 'assets/images/button.svg',
      //       name: 'טיול חדש',
      //       url: 'search',
      //     },
      //     {
      //       svgUrl: 'assets/images/report.svg',
      //       name: 'הטיולים שלי',
      //       url: 'search',
      //     },
      //   ],
      // },
      // navbarProjectSteps: [
      //   {
      //     text: 'בתהליך',
      //     src: 'assets/images/reload.svg',
      //     count: 3,
      //   },
      //   { text: 'מחכה לאישור', src: 'assets/images/report.svg', count: 1 },
      //   { text: 'סגור', src: 'assets/images/finish-flag.svg', count: 20 },
      // ],
      // wizardItems: ,
      }}
  };

  constructor() {}
}
