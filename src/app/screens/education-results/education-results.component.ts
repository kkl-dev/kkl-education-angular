import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { TooltipDataModel } from './tooltip/tooltip.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';

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
  dateObj: any;
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
    console.log(this.tripService);

    this.tripService.forestCenter.subscribe(forestCenter => {
      this.forestCenter = forestCenter; // this set's the username to the default observable value
      console.log('parent -- > forest Center from server BehaviorSubject:', this.forestCenter);
      // call api if place changed for dates and facilities;
      //console.log('fromOtherComponent: ' + this.fromOtherComponent);
      if (!this.fromOtherComponent) {
        this.getAvailableAccommodationDates(forestCenter);
      }
      //for facilities
      this.getAvailableFacilities();
      alert('iiuiu')
    });

    console.log('facilitiesArray: ', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    console.log('facilityForDay: ', this.facilityForDay);

    //deleted temp
    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    let a = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    console.log('a: ', a);

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
    console.log(this.tripService.sleepingDatesValues.calendarInput);
    this.changeDatesHandler(this.tripService.sleepingDatesValues.calendarInput);
  }
  //yak del not in use
  // public changeDate(newDate: number) {
  //   this.chosenDate = newDate;
  //   this.checkAvailabillityService.getNewFacilitiesArray(
  //     this.sleepingOptionsByDay[newDate].day
  //   );
  // }

  ngOnInit() {

    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
      this.dateObj = this.tripService.sleepingDates;
      for (let key in this.dateObj) {
        let value = this.dateObj[key];
        // Use `key` and `value`
        console.log('key :' + key);
        console.log('value :' + value);
      }
    }

    this.usersService.getLookupFieldForestCenters().subscribe((data: any) => {
      if (data) {
        console.log('getLookupFieldForestCenters: ', data);
      }
      else {
        console.log('no data in getLookupFieldForestCenters');
      }
    },
      error => {
        console.log({ error })
      });

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
    //     //   this.dateObj = this.tripService.dateObj;
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
    console.log('changeDatesHandler: newDates : ' + newDates)
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
    this.AvailableSleepingOptions = newSleepingOptionsByDay;
  }

  currentDayHandler(newCurrentDay: number) {
    console.log('facilityForDay: ', this.facilitiesArray[newCurrentDay].facilitiesList);
    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[newCurrentDay].day);
    //console.log('facilitiesArray', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[newCurrentDay].facilitiesList;
  }

  getAvailableFacilities() {
    //this.tripService.dateObj.from, this.tripService.dateObj.till
    this.usersService.getAvailableFacilities(this.forestCenter.id, this.tripService.sleepingDates.from, this.tripService.sleepingDates.till).subscribe((facilities: any) => {
      if (facilities) {
        console.log('getAvailableFacilities: ', facilities);
        this.facilitiesArray = facilities;
        this.facilityForDay = facilities[0].facilitiesList;
        console.log('facilityForDay: ', this.facilityForDay);
      }
      else {
        console.log('no data in getAvailableFacilities');
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