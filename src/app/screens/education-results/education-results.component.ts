import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { TooltipDataModel } from './tooltip/tooltip.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { MapsComponent } from './maps/maps.component';

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
  @ViewChild(MapsComponent) child: MapsComponent;
  forestCenter: any | undefined;
  //forestCenter: any | undefined = this.tripService.centerField || {};
  sleepingDates: any;
  fromOtherComponent: boolean = true;
  //public facilitiesArray: InfoCard[] = [];
  facilitiesArray: any = [{
    "date": "2021-09-10T:00:00:00",
    "facilitiesList": []
  }];

  facilityForDay: any;

  ////yak del 19-9-21
  // sleepingOptionsByDay: {
  //   day: string;
  //   options: {
  //     svgUrl: string;
  //     sleepingAreas: number;
  //     avialableSpaces: number;
  //     type: string;
  //     singleUnit: string;
  //   }[];
  // }[] = [
  //     {
  //       day: '01.9.21',
  //       options: [
  //         {
  //           svgUrl: 'assets/images/cabin.svg',
  //           sleepingAreas: 42,
  //           avialableSpaces: 146,
  //           type: 'בקתות',
  //           singleUnit: 'בבקתה',
  //         },
  //         {
  //           svgUrl: 'assets/images/tent.svg',
  //           sleepingAreas: 44,
  //           avialableSpaces: 46,
  //           type: 'אוהלים',
  //           singleUnit: 'באוהל',
  //         },
  //         {
  //           svgUrl: 'assets/images/camp.svg',
  //           sleepingAreas: 41,
  //           avialableSpaces: 1670,
  //           type: 'גיחה',
  //           singleUnit: 'לנים',
  //         },
  //       ],
  //     },
  //     {
  //       day: '02.9.21',
  //       options: [
  //         {
  //           svgUrl: 'assets/images/cabin.svg',
  //           sleepingAreas: 5,
  //           avialableSpaces: 166,
  //           type: 'בקתות',
  //           singleUnit: 'בבקתה',
  //         },
  //         {
  //           svgUrl: 'assets/images/tent.svg',
  //           sleepingAreas: 64,
  //           avialableSpaces: 636,
  //           type: 'אוהלים',
  //           singleUnit: 'באוהל',
  //         },
  //         {
  //           svgUrl: 'assets/images/camp.svg',
  //           sleepingAreas: 1,
  //           avialableSpaces: 670,
  //           type: 'גיחה',
  //           singleUnit: 'לנים',
  //         },
  //       ],
  //     },
  //     {
  //       day: '03.9.21',
  //       options: [
  //         {
  //           svgUrl: 'assets/images/cabin.svg',
  //           sleepingAreas: 72,
  //           avialableSpaces: 476,
  //           type: 'בקתות',
  //           singleUnit: 'בבקתה',
  //         },
  //         {
  //           svgUrl: 'assets/images/tent.svg',
  //           sleepingAreas: 4,
  //           avialableSpaces: 372,
  //           type: 'אוהלים',
  //           singleUnit: 'באוהל',
  //         },
  //         {
  //           svgUrl: 'assets/images/camp.svg',
  //           sleepingAreas: 1,
  //           avialableSpaces: 10,
  //           type: 'גיחה',
  //           singleUnit: 'לנים',
  //         },
  //       ],
  //     },
  //   ];

  AvailableSleepingOptions: any;

  constructor(private router: Router, private checkAvailabilityService: CheckAvailabilityService,
    public usersService: UserService, private route: ActivatedRoute,
    private userDataService: UserDataService, private tripService: TripService, private api: FakeService) {

      this.tripService.forestCenter.subscribe(forestCenter => {
        console.log('edudation result -- > forest Center from server BehaviorSubject:', this.forestCenter);
        // call api if place changed for dates and facilities;
        console.log('fromOtherComponent: ' + this.fromOtherComponent);
         if (!this.fromOtherComponent) {
          this.forestCenter = forestCenter; // this set's the username to the default observable value
          console.log('edudation result !fromOtherComponent -- > forest Center from server BehaviorSubject:', this.forestCenter);
         }
        //get Available Facilities
        //getAvailableFacilities is been called from changeDatesHandler;
        //this.getAvailableFacilities();
      });
   
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

    //console.log(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    // this.changeDatesHandler(this.checkAvailabillityService.checkAvailabilltyValues.calendarInput);
  }

  ngOnInit() {
    console.log(this.tripService);
    //this.changeDatesHandler(this.tripService.sleepingDates.from + "-" + this.tripService.sleepingDates.till);

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

    //fix -- on ng init called 3 times 
    //fix - if changed date called 2 t
    this.tripService.AvailableSleepingOptions.subscribe(AvailableSleepingOptions => {      
      this.AvailableSleepingOptions = AvailableSleepingOptions; // this set's the username to the default observable value
      console.log('educational -- > AvailableSleepingOptions:', this.AvailableSleepingOptions);
      this.getAvailableFacilities();
    });

    console.log('facilities Array in ngOnInit: ', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    console.log('facilityForDay: ', this.facilityForDay);
     //console.log('userDataService:', this.userDataService);
    //this.centerField = this.tripService.centerField
    this.fromOtherComponent = false;
  }

  // changeDatesHandler(newDates: string) {
  //   console.log('changeDatesHandler: newDates : ' + newDates);
  //   //console.log('sleepingOptionsByDay : ', this.sleepingOptionsByDay);
  //  // console.log(this.tripService);
  //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //   if (newDates && !newDates.includes('-')) {
  //     return;
  //   }
  //   const dates = newDates.split('-');
  //   this.getAvailableFacilities();

  //   let date1 = new Date(dates[0]);
  //   let date2 = new Date(dates[1]);
  //   // console.log('date 1', date1);
  //   // console.log('date 2', date2);

  //   const utc1 = Date.UTC(
  //     date1.getFullYear(),
  //     date1.getMonth(),
  //     date1.getDate(),
  //   );
  //   const utc2 = Date.UTC(
  //     date2.getFullYear(),
  //     date2.getMonth(),
  //     date2.getDate(),
  //   );

  //   const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
  //   const newSleepingOptionsByDay = [];

  //   let newDate = new Date(date1.setDate(date1.getDate()));
  //   for (let i = 0; i <= totalDays; i++) {
  //     //להכניס שורה שמחליפה תאירך לסטרינג של תאריך לתצוגה
  //     const newDateString = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
  //     newSleepingOptionsByDay.push({
  //       day: newDateString,
  //       options: [
  //         {
  //           svgUrl: 'assets/images/cabin.svg',
  //           sleepingAreas: 5,
  //           avialableSpaces: Math.floor(Math.random() * 8),
  //           type: 'בקתות',
  //           singleUnit: 'בבקתה',
  //         },
  //         {
  //           svgUrl: 'assets/images/tent.svg',
  //           sleepingAreas: 1,
  //           avialableSpaces: Math.floor(Math.random() * 20),
  //           type: 'אוהלים',
  //           singleUnit: 'באוהל',
  //         },
  //         {
  //           svgUrl: 'assets/images/camp.svg',
  //           sleepingAreas: 1,
  //           avialableSpaces: Math.floor(Math.random() * 90),
  //           type: 'גיחה',
  //           singleUnit: 'לנים',
  //         },
  //       ],
  //     });
  //     newDate = new Date(date1.setDate(date1.getDate() + 1));
  //   }
  //   // this.sleepingOptionsByDay = newSleepingOptionsByDay;
  //   console.log('AvailableSleepingOptions : ', newSleepingOptionsByDay);

  //   this.AvailableSleepingOptions = newSleepingOptionsByDay;
  // }

  currentDayHandler(newCurrentDay: number) {
    //this.emitCurrentDay.emit(newCurrentDay);
    this.child.currentDayHandler(newCurrentDay);

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
        this.facilityForDay = facilities[0].facilitiesList;
        this.facilitiesArray = facilities;
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