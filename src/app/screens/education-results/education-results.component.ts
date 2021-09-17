<<<<<<< HEAD
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CheckAvailabilityService} from 'src/app/utilities/services/check-availability.service';
import {TooltipDataModel} from './tooltip/tooltip.component';
import {UserDataService} from 'src/app/services/user-data.service';
import {UserService} from 'src/app/open-api';
import {TripService} from 'src/app/services/trip.service';
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { TooltipDataModel } from './tooltip/tooltip.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
>>>>>>> origin/yakovs-branch

export interface InfoCard {
  svgUrl: string;
  headline: string;
  subHeadline?: string;
  availability?: TooltipDataModel[];
}

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})

export class EducationResultsComponent implements OnInit {
  forestCenter: any | undefined;
  //forestCenter: any | undefined = this.tripService.centerField || {};

  // availabilityItemsArray: any = [];
  sleepingDates: any;
  fromOtherComponent: boolean = true;

  //public facilitiesArray: InfoCard[] = [];
  public facilitiesArray: any = [{
    "date": "2021-09-10T:00:00:00",
    "facilitiesList": [
      {
        "id": 8,
        "name": "כיתה קטנה",
        "maxOccupancy": 20,
        "occupiedHours": [
          {
            "fromHour": "2021-09-10T09:00:00",
            "tillHour": "2021-09-10T11:00:00",
            "customerName": "סימינר הקיבוצים"
          },
          {
            "fromHour": "2021-09-10T14:00:00",
            "tillHour": "2021-09-10T15:00:00",
            "customerName": "קיבוץ לביא"
          }
        ]
      },
      {
        "id": 8,
        "name": "כיתה dgfghdfg",
        "maxOccupancy": 20,
        "occupiedHours": [
          {
            "fromHour": "2021-09-10T09:00:00",
            "tillHour": "2021-09-10T11:00:00",
            "customerName": "סימינר ffff"
          },
          {
            "fromHour": "2021-09-10T14:00:00",
            "tillHour": "2021-09-10T15:00:00",
            "customerName": "קיבddddd ץ לביא"
          }
        ]
      }
    ]
  },
  {
    "date": "2021-09-10T:00:00:00",
    "facilitiesList": [
      {
        "id": 8,
        "name": "כיתה קטנה",
        "maxOccupancy": 20,
        "occupiedHours": [
          {
            "fromHour": "2021-09-10T09:00:00",
            "tillHour": "2021-09-10T11:00:00",
            "customerName": "סימינר הקיבוצים"
          },
          {
            "fromHour": "2021-09-10T14:00:00",
            "tillHour": "2021-09-10T15:00:00",
            "customerName": "קיבוץ לביא"
          }
        ]
      }
    ]
  }];
  facilityForDay: any;

  sleepingOptionsByDay: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }[];
  }[] = [
      {
        day: '01.9.21',
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 42,
            avialableSpaces: 146,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 44,
            avialableSpaces: 46,
            type: 'אוהלים',
            singleUnit: 'באוהל',
          },
          {
            svgUrl: 'assets/images/camp.svg',
            sleepingAreas: 41,
            avialableSpaces: 1670,
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      },
      {
        day: '02.9.21',
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 5,
            avialableSpaces: 166,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 64,
            avialableSpaces: 636,
            type: 'אוהלים',
            singleUnit: 'באוהל',
          },
          {
            svgUrl: 'assets/images/camp.svg',
            sleepingAreas: 1,
            avialableSpaces: 670,
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      },
      {
        day: '03.9.21',
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 72,
            avialableSpaces: 476,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 4,
            avialableSpaces: 372,
            type: 'אוהלים',
            singleUnit: 'באוהל',
          },
          {
            svgUrl: 'assets/images/camp.svg',
            sleepingAreas: 1,
            avialableSpaces: 10,
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      },
    ];

  AvailableSleepingOptions: any;

  constructor(private router: Router, private checkAvailabilityService: CheckAvailabilityService,
    public usersService: UserService, private route: ActivatedRoute,
    private userDataService: UserDataService, private tripService: TripService, private api: FakeService) {
   
    //deleted temp
    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    // let a = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    // console.log('checkAvailabilityService  a: ', a);

    // this.api.getAvailableFacilityDates('').subscribe((data) => {
    //   console.log('data', { data });

    //   if (data) {
    //     this.facilitiesArray = data[0];
    //     console.log('facilitiesArray from fake api', this.facilitiesArray);

    //   } else {
    //     console.log('no data in dates');
    //   }
    // },
    //   error => {
    //     console.log({ error });
    //   });

    //this.facilitiesArray = this.api.getAvailableFacilityDates('this.AvailableSleepingOptions[0].day');
    // console.log('facilitiesArray2', this.facilitiesArray);

    console.log(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    // this.changeDatesHandler(this.checkAvailabillityService.checkAvailabilltyValues.calendarInput);
    // this.changeDatesHandler('09/01/2021-09/04/2021');
  }
  //yak del not in use
  // public changeDate(newDate: number) {
  //   this.chosenDate = newDate;
  //   this.checkAvailabillityService.getNewFacilitiesArray(
  //     this.sleepingOptionsByDay[newDate].day
  //   );
  // }

  ngOnInit() {
    console.log(this.tripService);
    this.changeDatesHandler(this.tripService.sleepingDates.from + "-" + this.tripService.sleepingDates.till);

   // if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
      this.sleepingDates = this.tripService.sleepingDates;
      // for (let key in this.sleepingDates) {
      //   let value = this.sleepingDates[key];
      //   // Use `key` and `value`
      //   console.log('key :' + key);
      //   console.log('value :' + value);
      // }
    //}

    this.tripService.forestCenter.subscribe(forestCenter => {
      this.forestCenter = forestCenter; // this set's the username to the default observable value
      console.log('edudation result -- > forest Center from server BehaviorSubject:', this.forestCenter);
      // call api if place changed for dates and facilities;
      //console.log('fromOtherComponent: ' + this.fromOtherComponent);
      if (!this.fromOtherComponent) {
        // this.getAvailableAccommodationDates(forestCenter);
      }
      //get Available Facilities
      this.getAvailableFacilities();
    });

    console.log('facilitiesArray: ', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    console.log('facilityForDay: ', this.facilityForDay);

     //console.log('userDataService:', this.userDataService);
    //this.availabilityItemsArray = this.tripService.sleepingDates;
    //this.centerField = this.tripService.centerField
    this.fromOtherComponent = false;
  }

  getAvailableAccommodationDates(forestCenter: any) {
    //get forest center fake
    // this.api.getAvailableSleepingOptionsByDay('').subscribe((dates) => {
    //   if (dates) {
    //     console.log('dates', { dates });

    //     // if (this.tripService.centerField) {
    //     //  // this.forestCenterId = this.tripService.centerField.id;
    //     //   this.forestCenter = this.tripService.centerField;
    //     //   this.sleepingDates = this.tripService.sleepingDates;
    //     // }
    //   } else {
    //     console.log('no data in dates');
    //   }
    // },
    //   error => {
    //     console.log({ error });
    //   });
  }

  changeDatesHandler(newDates: string) {
    console.log('changeDatesHandler: newDates : ' + newDates);
    console.log('sleepingOptionsByDay : ', this.sleepingOptionsByDay);

    console.log(this.tripService);


    this.getAvailableFacilities();
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    if (newDates && !newDates.includes('-')) return;
    const dates = newDates.split('-');

    let date1 = new Date(dates[0]);
    let date2 = new Date(dates[1]);
    // console.log('date 1', date1);
    // console.log('date 2', date2);

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
    );

    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    const newSleepingOptionsByDay = [];

    let newDate = new Date(date1.setDate(date1.getDate()));
    for (let i = 0; i <= totalDays; i++) {
      //להכניס שורה שמחליפה תאירך לסטרינג של תאריך לתצוגה
      const newDateString = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
      newSleepingOptionsByDay.push({
        day: newDateString,
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 5,
            avialableSpaces: Math.floor(Math.random() * 8),
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 1,
            avialableSpaces: Math.floor(Math.random() * 20),
            type: 'אוהלים',
            singleUnit: 'באוהל',
          },
          {
            svgUrl: 'assets/images/camp.svg',
            sleepingAreas: 1,
            avialableSpaces: Math.floor(Math.random() * 90),
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      });
      newDate = new Date(date1.setDate(date1.getDate() + 1));
    }
    this.sleepingOptionsByDay = newSleepingOptionsByDay;
    console.log('sleepingOptionsByDay 2 : ', this.sleepingOptionsByDay);

    this.AvailableSleepingOptions = newSleepingOptionsByDay;
  }

  currentDayHandler(newCurrentDay: number) {
    console.log('facilityForDay: ', this.facilitiesArray[newCurrentDay].facilitiesList);
    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[newCurrentDay].day);
    //console.log('facilitiesArray', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[newCurrentDay].facilitiesList;
  }

  getAvailableFacilities() {
    let sleepingDates = this.tripService.convertDatesFromSlashToMinus();
    //this.tripService.sleepingDates.from, this.tripService.sleepingDates.till
    
    this.usersService.getAvailableFacilities(this.tripService.centerField.id, sleepingDates.from, sleepingDates.till).subscribe((facilities: any) => {
      console.log('get Available Facilities: ', facilities);
      if (facilities) {
        this.facilitiesArray = facilities;
        this.facilityForDay = facilities[0].facilitiesList;
        console.log('facility For Day: ', this.facilityForDay);
      }
    },
      error => {
        console.log({ error });
      });
  }

  onClick() {
    this.router.navigateByUrl('education/order-tour/squad-assemble');
  }
}