import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from '../../api/api/user.service';
import { TripService } from 'src/app/services/trip.service';
import { MapsComponent } from './maps/maps.component';

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})
export class EducationResultsComponent implements OnInit {
  // @ViewChild('child') child!: MapsComponent;
  centerField: string = 'מרכז שדה - נס הרים';
  forestCenter: any | undefined;
  availabilityItemsArray: any = [];
  dateObj: any;

  constructor(public usersService: UserService, private route: ActivatedRoute, private userDataService: UserDataService,
    private tripService: TripService) {

  }

  ngOnInit() {
    this.tripService.forestCenter.subscribe(result => {
      this.forestCenter = result; // this set's the username to the default observable value
      console.log('parent -- > forestCenter from server BehaviorSubject:', this.forestCenter);
      //this.changeForestCenter(result);
    });

    this.availabilityItemsArray = [
      { date: '15.06.21', text: '1' },
      { date: '16.06.21', text: '2' },
      { date: '17.06.21', text: '3' }
    ]

    if (this.tripService.centerField) {
      //this.forestCenterId = this.tripService.centerField.id;
      //this.forestCenterId = 1;
      this.dateObj = this.tripService.dateObj;

      for (let key in this.dateObj) {
        let value = this.dateObj[key];
        // Use `key` and `value`
    }
    }
    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     console.log('response: ', response);
    //   },
    //   error => console.log('error:', error),       // error
    //   () => console.log('completed')     // complete
    // );

    // this.usersService.getLookupFieldForestCenters().subscribe((data: any) => {
    //   //  this.spinner.hide();
    //     if (data) {
    //       console.log('getLookupFieldForestCenters: ', data);
    //     }
    //     else {
    //       console.log('no data in getLookupFieldForestCenters');
    //     }
    //   },
    //     error => {
    //   //    this.spinner.hide();
    //       console.log({ error })
    //     });

    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     console.log('response:', response);
    //   },
    //   error => console.log('error:', error),       // error
    //   () => console.log('completed')     // complete
    // );


    // console.log('userDataService:', this.userDataService);
    console.log('tripService:', this.tripService);
    

    //this.availabilityItemsArray = this.tripService.dateObj;
    //this.centerField = this.tripService.centerField



    console.log('getDifferenceInDays', this.getDifferenceInDays(this.date1, this.date2));
console.log('getDifferenceInHours', this.getDifferenceInHours(this.date1, this.date2));
console.log('getDifferenceInMinutes', this.getDifferenceInMinutes(this.date1, this.date2));
console.log('getDifferenceInSeconds', this.getDifferenceInSeconds(this.date1, this.date2));

  }
 date1 = new Date('7/13/2010');
date2 = new Date('12/15/2010');


 getDifferenceInDays(date1:any, date2:any) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

 getDifferenceInHours(date1:any, date2:any) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60);
}

 getDifferenceInMinutes(date1:any, date2:any) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60);
}

 getDifferenceInSeconds(date1:any, date2:any) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / 1000;
}


  // changeForestCenter(e: any, visible: any) {
  //   console.log('show 1 ', visible);
  //   this.child.changeForestCenter(visible);
  // }

  public chosenDate: number = 0

  public sleepingOptionsArray = [
    {
      svgUrl: 'assets/images/cabin.svg',
      sleepingAreas: 2,
      avialableSpaces: 16,
      type: 'בקתות',
      singleUnit: 'בבקתה'

    },
    {
      svgUrl: 'assets/images/tent.svg',
      sleepingAreas: 4,
      avialableSpaces: 36,
      type: 'אוהלים',
      singleUnit: 'באוהל'
    },
    {
      svgUrl: 'assets/images/camp.svg',
      sleepingAreas: 1,
      avialableSpaces: 120,
      type: 'גיחה',
      singleUnit: 'לנים'
    }
  ];

  public changeDate(newDate: number) {
    console.log('changeDate:', newDate);

    this.chosenDate = newDate;
  }

  public facilitiesArray = [
    {
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/museum.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/classroom.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 20 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/football.svg',
      headline: 'מגרש ספורט',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/leafs.svg',
      headline: 'סיור במשתלה',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/student-hat.svg',
      headline: 'מרכז למידה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/climbing.svg',
      headline: 'תחנות הפעלה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/judaism.svg',
      headline: 'בתי כנסה',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
  ];
}
