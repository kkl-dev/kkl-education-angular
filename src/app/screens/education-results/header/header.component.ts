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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild('resultsForm') signupForm: NgForm;
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();

  date: string | null = null;

  dateObj: { from: string; till: string } = { from: '', till: '' };
  forestCenter: any | undefined;
  tripDates: any | undefined;

  forestCenterOptions: any | undefined;
  forestCenterId: number = 1;
  formOptions: any;
  freeSpacesArray: FreeSpace[] = [];
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    maxDate: new Date(2022, 11, 15),

    // minDate: addDays(new Date(), 5),
    // maxDate: addDays(new Date(), 10),
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  constructor(
    public usersService: UserService, private userDataService: UserDataService,
    private checkAvailabilityService: CheckAvailabilityService,
    public tripService: TripService, public fakeApi: FakeService) {

    // this.dateObjChanged(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    this.dateObjChanged(this.tripService.sleepingDatesValues.calendarInput);
    this.freeSpacesArray = this.freeSpacesArrayGenarator(new Date(), new Date(2022, 11, 17));

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',
      closeOnSelected: true,
      // minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      maxDate: new Date(2022, 11, 15),
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    this.tripService.forestCenter.subscribe(forestCenter => {
      this.forestCenter = forestCenter;
    });

    //get forest center fake
    this.fakeApi.getForestCenter().subscribe((forestCenters) => {
      if (forestCenters) {
        console.log('forestCenter', { forestCenters });
        // this.formOptions = forestCenter;

        this.forestCenterOptions = forestCenters;

        // //save the forestCenters in server for acommodationList 
        // this.tripService.forestCenters = forestCenters;
        this.dateObj = this.tripService.sleepingDates;
        if (this.tripService.centerField) {
          this.forestCenterId = this.tripService.centerField.id;
          this.forestCenter = this.tripService.centerField;
          //this.dateObj = this.tripService.sleepingDates;

          let b = this.getDates(this.dateObj.from, this.dateObj.till);
          console.log('b:', b);
          let a = this.getDaysArray(this.dateObj.from, this.dateObj.till);
          console.log('a:', a);
        }
      } else {
        console.log('no data in forestCenter');
      }
    },
      error => {
        console.log({ error })
      });

    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     this.formOptions = response;
    //     //this.tripService.centerField = this.formOptions[0];
    //   },
    // )

    //  this.dateObj = this.tripService.dateObj;
    //  this.forestCenter = this.tripService.centerField;
  }

  addDays(days: any) {
    var date = new Date(days);
    date.setDate(date.getDate() + days);
    return date;
  }

  getDates(startDate: any, stopDate: any) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = currentDate.this.addDays(1);
    }
    return dateArray;
  }

  updateForestCenter(id: any) {
    this.forestCenter = this.forestCenterOptions.find((center: { id: any; }) => center.id === id);
    console.log('updateForestCenter obj =>', this.forestCenter);
    this.tripService.updateForestCenter(this.forestCenter);
  }

  updateTripDates(dates: any) {
    // this.tripDates = this.forestCenterOptions.find((center: { id: any; }) => center.id === id);
    console.log('updateTripDates =>', this.forestCenter);
    console.log('dates =>', dates);

    this.tripService.updateSleepingDates(this.dateObj);
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

  freeSpacesArrayGenarator(start: Date, end: Date) {
    let i = 0;
    let freeSpacesArrayTemp: FreeSpace[] = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArrayTemp.push({
        date: start,
        freeSpace:
          [
            {
              accomodationName: "cabin",
              availableBeds: +Math.floor(Math.random() * 8).toString()
            },
            {
              accomodationName: "tent",
              availableBeds: +Math.floor(Math.random() * 8).toString()
            },
            {
              accomodationName: "room",
              availableBeds: +Math.floor(Math.random() * 8).toString()
            },
          ]

        // {
        //   "date": "2015-07-20T15:49:04-07:00",
        //   "freeSpaces": [
        //     {
        //       "accomodationName": "name",
        //       "availableBeds": 20
        //     }
        //   ]
        // }
      });
      i++;
    }
    return freeSpacesArrayTemp;
  }

  dateObjChanged(e: string) {
    if (e && e.includes('-')) {
      console.log('dateObjChanged =>', e);
      //this.updateTripDates(e);

      this.emitNewDates.emit(e);
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      let from = tempDateArr[0].replace(/\//g, '-');
      let till = tempDateArr[1].replace(/\//g, '-');

      if (new Date(tempDateArr[0]) < new Date(tempDateArr[1])) {
        this.dateObj.from = from;
        this.dateObj.till = till;
      } else {
        this.dateObj.from = from;
        this.dateObj.till = till;
      }
      this.tripService.sleepingDates.from = this.dateObj.from;
      this.tripService.sleepingDates.till = this.dateObj.till;

      this.tripService.updateSleepingDates(this.dateObj);
    } else {
      this.dateObj.from = e;
      this.dateObj.till = '';
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
