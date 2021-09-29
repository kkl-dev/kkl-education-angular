import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { subDays, addDays } from 'date-fns';
import { Locale, getYear } from 'date-fns';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { AvailableAccomodationDate, FieldForestCenter } from 'src/app/open-api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild('resultsForm') signupForm: NgForm;
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();

  date: string | null = null;
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  forestCenter: FieldForestCenter | undefined;
  tripDates: any | undefined;
  forestCenterOptions: any | undefined;
  forestCenterId: number = 1;
  formOptions: any;
  AvailableDates!: AvailableAccomodationDate[];
  // AcommodationType = 'בקתה';
  //disableDates = true;

  freeSpacesArray: FreeSpace[] = [];
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    maxDate: new Date(2022, 11, 15),
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  constructor(public usersService: UserService, private userDataService: UserDataService,
    private checkAvailabilityService: CheckAvailabilityService, public tripService: TripService, public fakeApi: FakeService) {

    this.freeSpacesArray = this.tripService.freeSpacesArray;
    this.tripService.getAvailableSleepingOptions();
    // this.dateObjChanged(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    //this.freeSpacesArray = this.freeSpacesArrayGenarator(new Date(), new Date(2022, 11, 17));
    this.options = {
      firstCalendarDay: 0,
      format: 'dd/LL/yyyy', 
      closeOnSelected: true,
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      maxDate: new Date(2022, 11, 15),
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    this.forestCenterOptions = this.tripService.formOptions;
    this.forestCenterId = this.tripService.centerField.id;
    this.forestCenter = this.tripService.centerField;
    this.sleepingDates = this.tripService.sleepingDates;
    if (typeof(Storage) !== "undefined") {
      // localStorage.setItem("sleepingDateStart",this.sleepingDates.from);
      // localStorage.setItem("sleepingDateTill",this.sleepingDates.till);
     
    }   
    this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());

    //yak del 19-9-21 bug in addDays
    // let b = this.getDates(this.sleepingDates.from, this.sleepingDates.till);
    // console.log('b:', b);
    // let a = this.getDaysArray(this.sleepingDates.from, this.sleepingDates.till);
    // console.log('a:', a);
  }

  getAvailableDates(fromDate: string, tillDate: string) {
    fromDate = fromDate.substring(0, 10)
    tillDate = tillDate.substring(0, 10)
    // tillDate = '2021-11-30'
    this.usersService.getAvailableAccomodationDates(this.tripService.centerField.id, fromDate, tillDate).subscribe(
      response => {
        console.log(response)
        this.AvailableDates = response;
        this.AvailableDates.forEach(element => element.freeSpace.forEach(element => { if (element.availableBeds === undefined) { element.availableBeds = 0; } }));
        this.freeSpacesArray = this.freeSpacesArrayGenaratorFromServer(new Date(fromDate), new Date(tillDate));
        this.tripService.setFreeSpacesArray(this.freeSpacesArray);
        this.options = {
          firstCalendarDay: 0,
          format: 'LL/dd/yyyy',
          maxDate: new Date(tillDate),
          closeOnSelected: true,
          minYear: new Date().getFullYear() - 1,
          maxYear: new Date(tillDate).getFullYear() + 1,
          freeSpacesArray: this.freeSpacesArray,
        };
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  freeSpacesArrayGenaratorFromServer(start: Date, end: Date) {
    var i = 0;
    let freeSpacesArray = [];
    while (start < end && i <= this.AvailableDates.length) {
      freeSpacesArray.push({
        date: start,
        freeSpace:
          [
            {
              accomodationName: this.AvailableDates[i].freeSpace[0].accomodationName,
              availableBeds: this.AvailableDates[i].freeSpace[0].availableBeds
            },
            {
              accomodationName: this.AvailableDates[i].freeSpace[1].accomodationName,
              availableBeds: this.AvailableDates[i].freeSpace[1].availableBeds
            },
            {
              accomodationName: this.AvailableDates[i].freeSpace[2].accomodationName,
              availableBeds: this.AvailableDates[i].freeSpace[2].availableBeds
            },
            {
              accomodationName: this.AvailableDates[i].freeSpace[3].accomodationName,
              availableBeds: this.AvailableDates[i].freeSpace[3].availableBeds
            },
          ]
      });
      start = new Date(start.setDate(start.getDate() + 1)); i++;
    }
    return freeSpacesArray;
  }

  // addDays(days: any) {
  //   var date = new Date(days);
  //   date.setDate(date.getDate() + days);
  //   return date;
  // }

  // getDates(startDate: any, stopDate: any) {
  //   var dateArray = new Array();
  //   var currentDate = startDate;
  //   while (currentDate <= stopDate) {
  //     dateArray.push(new Date(currentDate));
  //     currentDate = currentDate.this.addDays(1);
  //   }
  //   return dateArray;
  // }

  updateForestCenter(id: any) {
    this.forestCenter = this.forestCenterOptions.find((center: { id: any; }) => center.id === id);
    this.tripService.centerField = this.forestCenter;
    this.tripService.updateForestCenter(this.forestCenter);
    console.log('updateForestCenter obj =>', this.forestCenter);
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  }

  // freeSpacesArrayGenarator(start: Date, end: Date) {
  //   let i = 0;
  //   let freeSpacesArrayTemp: FreeSpace[] = [];
  //   while (start < end) {
  //     start = new Date(start.setDate(start.getDate() + 1));
  //     freeSpacesArrayTemp.push({
  //       date: start,
  //       freeSpace:
  //         [
  //           {
  //             accomodationName: "cabin",
  //             availableBeds: +Math.floor(Math.random() * 8).toString()
  //           },
  //           {
  //             accomodationName: "tent",
  //             availableBeds: +Math.floor(Math.random() * 8).toString()
  //           },
  //           {
  //             accomodationName: "room",
  //             availableBeds: +Math.floor(Math.random() * 8).toString()
  //           },
  //         ]

  //       // {
  //       //   "date": "2015-07-20T15:49:04-07:00",
  //       //   "freeSpace": [
  //       //     {
  //       //       "accomodationName": "name",
  //       //       "availableBeds": 20
  //       //     }
  //       //   ]
  //       // }
  //     });
  //     i++;
  //   }
  //   return freeSpacesArrayTemp;
  // }

  dateObjChanged(e: string) {
    if (e && e.includes('-')) {
      console.log('dateObjChanged =>', + e);
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      const dateFormat1 = tempDateArr[0].split('/').reverse();
      dateFormat1[1] = (+dateFormat1[1] - 1).toString();
      dateFormat1[2] = (+dateFormat1[2]).toString(); 
      const dateFormat2 = tempDateArr[1].split('/').reverse();
      dateFormat2[1] = (+dateFormat2[1] - 1).toString();
      dateFormat2[2] = (+dateFormat2[2]).toString();
    
      if (new Date(dateFormat1.join(',')) < new Date(dateFormat2.join(','))) {
        this.sleepingDates.from = tempDateArr[0];
        this.sleepingDates.till = tempDateArr[1];
      } else {
        // commented by itiel, need tk check the comrax version
        // this.sleepingDates.from = tempDateArr[1];
        // this.sleepingDates.till = tempDateArr[0];
        this.sleepingDates.from = tempDateArr[0];
        this.sleepingDates.till = tempDateArr[1];
      }
      this.tripService.sleepingDates.from = this.sleepingDates.from;
      this.tripService.sleepingDates.till = this.sleepingDates.till;
      this.emitNewDates.emit(e);

      this.tripService.getAvailableSleepingOptions();
    } else {
      this.sleepingDates.from = e;
      this.sleepingDates.till = '';
    }
  }

  newDateRecived(newDate: any) {
    console.log(newDate);
  }

  prevDateRecived(prevDate: any) {
    console.log(prevDate);
  }

  newSleepingPlaceRecived(sleepingPlace: any) {
    console.log(sleepingPlace);

  }
}