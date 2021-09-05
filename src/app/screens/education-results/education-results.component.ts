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
  availability: TooltipDataModel[];
}

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})

export class EducationResultsComponent implements OnInit {
  // @ViewChild('child') child!: MapsComponent;
  centerField: string = 'מרכז שדה - נס הרים';
  forestCenter: any | undefined;
  //forestCenter: any | undefined = this.tripService.centerField || {};

  // availabilityItemsArray: any = [];
  dateObj: any;
  fromOtherComponent: boolean = true;

  // public sleepingOptionsArray = [
  //   {
  //     svgUrl: 'assets/images/cabin.svg',
  //     sleepingAreas: 42,
  //     avialableSpaces: 16,
  //     type: 'בקתות',
  //     singleUnit: 'בבקתה'
  //   },
  //   {
  //     svgUrl: 'assets/images/tent.svg',
  //     sleepingAreas: 28,
  //     avialableSpaces: 36,
  //     type: 'אוהלים',
  //     singleUnit: 'באוהל'
  //   },
  //   {
  //     svgUrl: 'assets/images/camp.svg',
  //     sleepingAreas: 22,
  //     avialableSpaces: 120,
  //     type: 'גיחה',
  //     singleUnit: 'לנים'
  //   }
  // ];
  public facilitiesArray: InfoCard[] = [];
  public chosenDate: number = 0

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
      {
        day: '04.9.21',
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 24,
            avialableSpaces: 186,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 46,
            avialableSpaces: 386,
            type: 'אוהלים',
            singleUnit: 'באוהל',
          },
          {
            svgUrl: 'assets/images/camp.svg',
            sleepingAreas: 17,
            avialableSpaces: 120,
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      }
    ];

  public changeDate(newDate: number) {
    this.chosenDate = newDate;
    this.checkAvailabillityService.getNewFacilitiesArray(
      this.sleepingOptionsByDay[newDate].day
    );
  }

  constructor(private router: Router, private checkAvailabillityService: CheckAvailabilityService,
    public usersService: UserService, private route: ActivatedRoute,
    private userDataService: UserDataService, private tripService: TripService, private api: FakeService) {

    this.tripService.forestCenter.subscribe(forestCenter => {
      this.forestCenter = forestCenter; // this set's the username to the default observable value
      console.log('parent -- > forest Center from server BehaviorSubject:', this.forestCenter);
      // call api if place changed for dates and facilities;
      console.log('fromOtherComponent: ' + this.fromOtherComponent);
      if (!this.fromOtherComponent) {
        this.getAvailableAccommodationDates();
      }
    });

    this.facilitiesArray = this.checkAvailabillityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    console.log(this.checkAvailabillityService.checkAvailabilltyValues.calendarInput);
    // this.changeDatesHandler(this.checkAvailabillityService.checkAvailabilltyValues.calendarInput);

    console.log(this.tripService.sleepingDatesValues.calendarInput);
     this.changeDatesHandler(this.tripService.sleepingDatesValues.calendarInput);

  }

  ngOnInit() {

    if (this.tripService.centerField) {
      this.forestCenter = this.tripService.centerField;
      this.dateObj = this.tripService.dateObj;
      for (let key in this.dateObj) {
        let value = this.dateObj[key];
        // Use `key` and `value`
        console.log('key :' + key);
        console.log('value :' + value);
      }
    }

    // this.availabilityItemsArray = [
    //   { date: '15.06.21', text: '1' },
    //   { date: '16.06.21', text: '2' },
    //   { date: '17.06.21', text: '3' }
    // ]

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
    this.fromOtherComponent = false;
  }

  getAvailableAccommodationDates() {
    //get forest center fake
    this.api.getAvailableAccommodationDates().subscribe((dates) => {
      if (dates) {
        console.log('dates', { dates });

        // if (this.tripService.centerField) {
        //  // this.forestCenterId = this.tripService.centerField.id;
        //   this.forestCenter = this.tripService.centerField;
        //   this.dateObj = this.tripService.dateObj;
        // }
      } else {
        console.log('no data in dates');
      }
    },
      error => {
        console.log({ error });
      });
  }


  currentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
    this.facilitiesArray = this.checkAvailabillityService.getNewFacilitiesArray(
      this.sleepingOptionsByDay[newCurrentDay].day
    );
  }

  changeDatesHandler(newDates: string) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    if (newDates && !newDates.includes('-')) return;
    const dates = newDates.split('-');

    let date1 = new Date(dates[0]);
    let date2 = new Date(dates[1]);
    console.log('date 1', date1);
    console.log('date 2', date2);

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
            avialableSpaces: 7,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 1,
            avialableSpaces: 20,
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
  }

  public onClick() {
    this.router.navigateByUrl('education/order-tour/squad-assemble');
  }
}