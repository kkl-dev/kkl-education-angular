import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { TooltipDataModel } from './tooltip/tooltip.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from '../../api/api/user.service';
import { TripService } from 'src/app/services/trip.service';

export interface InfoCard {
  svgUrl: string;
  headline: string;
  subHeadline?: string;
  availability?: TooltipDataModel[];
  maxParticipants?:string;
  days?:any[];
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
  availabilityItemsArray: any = [];
  dateObj: any;

  ngOnInit() {
    this.tripService.forestCenter.subscribe((result) => {
      this.forestCenter = result; // this set's the username to the default observable value
    });

    this.availabilityItemsArray = [
      { date: '15.06.21', text: '1' },
      { date: '16.06.21', text: '2' },
      { date: '17.06.21', text: '3' },
    ];

    if (this.tripService.centerField) {
      this.dateObj = this.tripService.dateObj;

      for (let key in this.dateObj) {
        let value = this.dateObj[key];
      }
    }
  }

  date1 = new Date('7/13/2010');
  date2 = new Date('12/15/2010');

  getDifferenceInDays(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  getDifferenceInHours(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
  }

  getDifferenceInMinutes(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }

  getDifferenceInSeconds(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000;
  }

  public sleepingOptionsArray = [
    {
      svgUrl: 'assets/images/cabin.svg',
      sleepingAreas: 2,
      avialableSpaces: 16,
      type: 'בקתות',
      singleUnit: 'בבקתה',
    },
    {
      svgUrl: 'assets/images/tent.svg',
      sleepingAreas: 4,
      avialableSpaces: 36,
      type: 'אוהלים',
      singleUnit: 'באוהל',
    },
    {
      svgUrl: 'assets/images/camp.svg',
      sleepingAreas: 1,
      avialableSpaces: 120,
      type: 'גיחה',
      singleUnit: 'לנים',
    },
  ];

  // changeForestCenter(e: any, visible: any) {
  //   this.child.changeForestCenter(visible);
  // }

  public chosenDate: number = 0;

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
      day: '15.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 6,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 1670,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '16.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
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
      day: '17.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 46,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 32,
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
      day: '18.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 120,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '19.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 120,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
  ];

  public changeDate(newDate: number) {
    this.chosenDate = newDate;
    this.checkAvailabillityService.getNewFacilitiesArray(
      this.sleepingOptionsByDay[newDate].day
    );
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


    let dateFormat1 = dates[0].split('/').reverse();
    dateFormat1[1] = (+dateFormat1[1] ).toString();
    dateFormat1[2] = (+dateFormat1[2]).toString();
    let dateFormat2 = dates[1].split('/').reverse();
    dateFormat2[1] = (+dateFormat2[1] ).toString();
    dateFormat2[2] = (+dateFormat2[2]).toString();
    let tempDate = [];
    if (new Date(dateFormat1.join(',')) > new Date(dateFormat2.join(','))) {
      tempDate = dateFormat1;
      dateFormat1 = dateFormat2;
      dateFormat2 = tempDate;
    }
    let date1 = new Date(dateFormat1.join(','));
    let date2 = new Date(dateFormat2.join(','));
    let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  

    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    const newSleepingOptionsByDay = [];

    let newDate = new Date(date1.setDate(date1.getDate()));
    
    for (let i = 0; i <= totalDays; i++) {
      //להכניס שורה שמחליפה תאירך לסטרינג של תאריך לתצוגה
      const newDateString = `${newDate.getDate()}.${(
        newDate.getMonth() + 1
      ).toString()}.${newDate.getFullYear()}`;
      newSleepingOptionsByDay.push({
        day: newDateString,
        options: [
          {
            svgUrl: 'assets/images/cabin.svg',
            sleepingAreas: 2,
            avialableSpaces: 16,
            type: 'בקתות',
            singleUnit: 'בבקתה',
          },
          {
            svgUrl: 'assets/images/tent.svg',
            sleepingAreas: 4,
            avialableSpaces: 6,
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

  public facilitiesArray: InfoCard[] = [];

  constructor(
    private router: Router,
    private checkAvailabillityService: CheckAvailabilityService,
    public usersService: UserService,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private tripService: TripService
  ) {
    this.facilitiesArray = this.checkAvailabillityService.getNewFacilitiesArray(
      this.sleepingOptionsByDay[0].day
    );

    this.changeDatesHandler(
      this.checkAvailabillityService.checkAvailabilltyValues.calendarInput
    );
  }

  public onClick() {
    this.router.navigateByUrl('education/order-tour/squad-assemble');
  }
}
