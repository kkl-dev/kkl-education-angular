import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { subDays, addDays } from 'date-fns';
import { Locale, getYear } from 'date-fns';
import { UserDataService } from 'src/app/services/user-data.service';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //@ViewChild('forestCenter') forestCenter: ElementRef | undefined;
  //@ViewChild('forestCenter', {static: true}) signupForm: NgForm;
  //@Input() categoryId: string;
  @ViewChild('resultsForm') signupForm: NgForm;
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();

  date: string | null = null;
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  forestCenter: any | undefined;
  forestCenterOptions: any | undefined;
  forestCenterId: number = 101;
  formOptions: any;
  location = '';

  freeSpacesArray: FreeSpace[] = [];

  constructor(
    public usersService: UserService,
    private userDataService: UserDataService,
    private checkAvailabillityService: CheckAvailabilityService,
    public tripService: TripService,
    public fakeApi: FakeService
  ) {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2022, 11, 17)
    );

    this.dateObjChanged(
      this.checkAvailabillityService.checkAvailabilltyValues.calendarInput
    );

    this.location = this.checkAvailabillityService.checkAvailabilltyValues.sleepingPlace;
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2022, 11, 17)
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',
      closeOnSelected: true,
      // minDate: addDays(new Date(), 5),
      // maxDate: addDays(new Date(), 10),
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    this.tripService.forestCenter.subscribe((result) => {
      //this.forestCenter = result; // this set's the username to the default observable value
    });

    //get forest center fake
    this.fakeApi.getForestCenter().subscribe((forestCenters) => {
      if (forestCenters) {
        console.log('forestCenter', { forestCenters });
        // this.formOptions = forestCenter;
        this.forestCenterOptions = forestCenters;
        if (this.tripService.centerField) {
          this.forestCenterId = this.tripService.centerField.id;
          this.forestCenter = this.tripService.centerField;
          this.sleepingDates = this.tripService.sleepingDates;

          let b = this.getDates(this.sleepingDates.from, this.sleepingDates.till);
          console.log('b:', b);


          let a = this.getDaysArray(this.sleepingDates.from, this.sleepingDates.till);
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
    let forest = this.forestCenterOptions.find((q: { id: any }) => q.id === id);

    this.tripService.changeForestCenter(forest);
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

  
  newDateRecived(newDate:any){
    console.log(newDate); 
    
  }
  prevDateRecived(prevDate:any){
    console.log(prevDate); 
    
  }
  
  newSleepingPlaceRecived(sleepingPlace:any){
    console.log(sleepingPlace); 
    
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
      });
      i++;
    }
    return freeSpacesArrayTemp;
  }
  

  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',

    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  public dateObjChanged(e: string) {
    if (e && e.includes('-')) {
      this.emitNewDates.emit(e);
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      if (new Date(tempDateArr[0]) < new Date(tempDateArr[1])) {
        this.sleepingDates.from = tempDateArr[0];
        this.sleepingDates.till = tempDateArr[1];
      } else {
        this.sleepingDates.from = tempDateArr[1];
        this.sleepingDates.till = tempDateArr[0];
      }
    } else {
      this.sleepingDates.from = e;
      this.sleepingDates.till = '';
    }
  }
}
