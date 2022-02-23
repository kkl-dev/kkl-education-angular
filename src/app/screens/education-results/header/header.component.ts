import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { subDays, addDays } from 'date-fns';
import { Locale, getYear } from 'date-fns';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { AvailableAccomodationDate, FieldForestCenter } from 'src/app/open-api/model/models';

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
  forestCenterId: number;
  formOptions: any;
  AvailableDates!: AvailableAccomodationDate[];
  // AcommodationType = 'בקתה';
  //disableDates = true;
  location = '';
  options!: CalendarOptions;

  freeSpacesArray: FreeSpace[] = [];
  // options: CalendarOptions = {
  //   firstCalendarDay: 0,
  //   format: 'LL/dd/yyyy',
  //   closeOnSelected: true,
  //   maxDate: new Date(2022, 11, 15),
  //   minYear: 2019,
  //   maxYear: 2021,
  //   freeSpacesArray: this.freeSpacesArray,
  // };

  constructor(public usersService: UserService, private userDataService: UserDataService,
    private checkAvailabilityService: CheckAvailabilityService, public tripService: TripService, public fakeApi: FakeService) {

    this.freeSpacesArray = this.tripService.freeSpacesArray;
    this.tripService.getAvailableSleepingOptions();
    let str = this.sleepingDates.from.split("/");
    let str2 = this.sleepingDates.till.split("/");
    let yearFrom= +str[2];
    let monthFrom = (+str[1])-1
    let dayFrom = + str[0];
    let yearEnd= +str2[2];
    let monthEnd = (+str2[1])-1
    let dayEnd=  +str2[0];
    // this.dateObjChanged(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    this.options = {
      firstCalendarDay: 0,
      format: 'dd/LL/yyyy',
      closeOnSelected: true,
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      maxDate: new Date(2022, 11, 15),
      fromToDate:{from: new Date(yearFrom,monthFrom,dayFrom) , to : new Date(yearEnd,monthEnd,dayEnd)},
      freeSpacesArray: this.freeSpacesArray,
    };

  }

  ngOnInit() {
    this.forestCenterOptions = this.tripService.formOptions;
    console.log('forestCenterOptions: ', this.forestCenterOptions);
    this.forestCenterOptions = this.forestCenterOptions.filter(aco => aco.accommodationList.length > 0);
    this.forestCenterId = this.tripService.centerField.id;
    this.forestCenter = this.tripService.centerField;
    this.sleepingDates = this.tripService.sleepingDates;
    if (typeof (Storage) !== "undefined") {
      // localStorage.setItem("sleepingDateStart",this.sleepingDates.from);
      // localStorage.setItem("sleepingDateTill",this.sleepingDates.till);

    }
    var tillDate = new Date()
    tillDate.setFullYear(new Date().getFullYear() + 1);
    tillDate.setMonth(new Date().getMonth() + 6);
    this.getAvailableDates(new Date().toISOString(), tillDate.toISOString());
  }

  getAvailableDates(fromDate: string, tillDate: string) {
    fromDate = fromDate.substring(0, 10);
    tillDate = tillDate.substring(0, 10);
    this.usersService.getAvailableAccomodationDates(this.tripService.centerField.id, fromDate, tillDate).subscribe(
      response => {
        console.log('get Available Dates:', response)
        this.AvailableDates = response;
        this.AvailableDates.forEach(element => element.freeSpace.forEach(element => { if (element.availableBeds === undefined) { element.availableBeds = 0; } }));
        this.freeSpacesArray = this.freeSpacesArrayGenaratorFromServer(new Date(fromDate), new Date(tillDate));
        this.tripService.setFreeSpacesArray(this.freeSpacesArray);
        this.options = {
          firstCalendarDay: 0,
          format: 'dd/LL/yyyy',
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
    start.setDate(start.getDate() - 1);
    while (start < end && i <= this.AvailableDates.length) {
     // while (start < end && i < this.AvailableDates.length) {

      // for (var j in this.AvailableDates[i].freeSpace) {
      freeSpacesArray.push({
        date: start,
        freeSpace: this.AvailableDates[i].freeSpace
      });
      start = new Date(start.setDate(start.getDate() + 1)); i++;

     // start = new Date(start.setDate(start.getDate())); i++;
    }
    return freeSpacesArray;
  }

  updateForestCenter(id: any) {
    this.forestCenter = this.forestCenterOptions.find((center: { id: any; }) => center.id === id);
    this.tripService.centerField = this.forestCenter;
    this.tripService.updateForestCenter(this.forestCenter);
    //console.log('update ForestCenter obj =>', this.forestCenter);
    var tillDate = new Date()
    tillDate.setFullYear(new Date().getFullYear() + 1);
    tillDate.setMonth(new Date().getMonth() + 6);
    this.getAvailableDates(new Date().toISOString(), tillDate.toISOString());
  }

  // getDaysArray(start: any, end: any) {
  //   for (
  //     var arr = [], dt = new Date(start);
  //     dt <= end;
  //     dt.setDate(dt.getDate() + 1)
  //   ) {
  //     arr.push(new Date(dt));
  //   }
  //   return arr;
  // }

  dateObjChanged(e: string) {
    if (e && e.includes('-')) {
      console.log('dateObj Changed =>', + e);
      this.emitNewDates.emit(e);
      
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      const dateFormat1 = tempDateArr[0].split('/').reverse();
      console.log(dateFormat1[1]);
      dateFormat1[1] = (+dateFormat1[1]).toString();
      dateFormat1[2] = (+dateFormat1[2]).toString();
      const dateFormat2 = tempDateArr[1].split('/').reverse();
      dateFormat2[1] = (+dateFormat2[1]).toString();
      dateFormat2[2] = (+dateFormat2[2]).toString();


      if (new Date(dateFormat1.join(',')) < new Date(dateFormat2.join(','))) {
        this.sleepingDates.from = tempDateArr[0];
        this.sleepingDates.till = tempDateArr[1];
      } else {
      
        this.sleepingDates.from = tempDateArr[1];
        this.sleepingDates.till = tempDateArr[0];
      }
      this.tripService.sleepingDates.from = this.sleepingDates.from;
      this.tripService.sleepingDates.till = this.sleepingDates.till;
      //this.emitNewDates.emit(e);

      this.tripService.getAvailableSleepingOptions();
    } else {
      this.sleepingDates.from = e;
      this.sleepingDates.till = '';
    }
  }

  newDateRecived(newDate: any) {
    console.log('newDate: ' + newDate);
  }

  prevDateRecived(prevDate: any) {
    console.log('prevDate: ' + prevDate);
  }

  newSleepingPlaceRecived(sleepingPlace: any) {
    console.log('sleepingPlace: ' + sleepingPlace);

  }
}
