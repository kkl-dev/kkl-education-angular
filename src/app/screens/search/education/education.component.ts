import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { getYear } from 'date-fns';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripService } from '../../../services/trip.service'
import { AccommodationType, AvailableAccomodationDate } from 'src/app/open-api';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {

  @ViewChild('educationForm') signupForm: NgForm;
  @Output() emitFormValues: EventEmitter<NgForm> = new EventEmitter();
  public checked = false;
  sleepingPlace: any;
  // sleepingPlace: string = '';
  disableDates = true;
  disableContinueBtn = true;
  checkedSingleDay = false;
  routerLinkContinue = '/education/results'
  AvailableDates!: AvailableAccomodationDate[];
  AcommodationTypes!: AccommodationType[];
  AcommodationType = 'בקתה';

  date: string | null = null;
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[] = [];

  constructor(public usersService: UserService, private router: Router,private _dialog: MatDialog, public tripService: TripService,
    private checkAvailabilltyService: CheckAvailabilityService) {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',
      // maxDate: new Date(2021, 11, 15),
      maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      closeOnSelected: true,
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    this.tripService.getLookupFieldForestCenters();
  }

  selectChange(event: any) {
    this.tripService.centerField = this.tripService.formOptions.filter((el: { id: number; }) => el.id === parseInt(event.value))[0];
    this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
    this.disableDates = false;
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
        this.disableDates = false;

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


  freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArray = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArray.push({
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
    }
    return freeSpacesArray;
  }

  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };



  newDateRecived(newDate: any) {
    console.log(newDate);
    // if (new Date(newDate).getFullYear() === new Date(this.AvailableDates[this.AvailableDates.length].date).getFullYear()) {
    //   this.getAvailableDates(
    //     new Date().toISOString(),
    //     new Date(new Date().setFullYear(newDate.getFullYear() + 1)).toISOString()
    //   );
    //   this.options = {
    //     firstCalendarDay: 0,
    //     format: 'LL/dd/yyyy',
    //     maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    //     closeOnSelected: true,
    //     minYear: new Date().getFullYear() - 1,
    //     maxYear: newDate.getFullYear() + 1,
    //     freeSpacesArray: this.freeSpacesArray,
    //   };
    // }
  }
  prevDateRecived(prevDate: any) {
    console.log(prevDate);

  }

  newSleepingPlaceRecived(sleepingPlace: any) {
    console.log(sleepingPlace);
    this.AcommodationTypes = sleepingPlace;
  }

  public dateObjChanged(e: string) {
    console.log('asdasd');
    
    if (e.includes('-')) {
      
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
    this.disableContinueBtn = false;
    this.tripService.sleepingDates = this.sleepingDates;

  }

  AvailableDaysChecking() {
    this.tripService.dateRange = this.getDaysArray(new Date(this.sleepingDates.from), new Date(this.sleepingDates.till))
    var flag = true;
    for (var i in this.tripService.dateRange) {
      let typeAmount = this.tripService.dateRange[i].freeSpace.find(element => element.accomodationName === this.AcommodationTypes);
      if (typeAmount.availableBeds === 0) { flag = false; }
      //if (!flag) { console.log('אחד הימים בטווח התאריכים אינו פנוי'); return flag; }
      if (!flag) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: { message: 'אחד  הימים בטווח התאריכים אינו פנוי', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        }); console.log('אחד  הימים בטווח התאריכים אינו פנוי'); return flag;
      }
    }
    return flag;
  }
  
  hideSelectPlaceholder(sel: MatSelect) {
    sel.placeholder = '';
  }

  showSelectPlaceholder(sel: MatSelect) {
    if (sel.value === '') {
      sel.placeholder = 'בחר מרכז שדה';
    }
  }

  printFormValues() {
    if (this.signupForm != undefined && this.AvailableDaysChecking()) {
      this.emitFormValues.emit(this.signupForm);
      this.checkAvailabilltyService.saveCheackAvailabilltyValues(this.signupForm)
      this.router.navigate([this.routerLinkContinue])
    }
  }
  singleDayTrip() { if (this.checkedSingleDay) { this.routerLinkContinue = '/education/my-tours' } }

  // convertDate(today: any) {//function to change date format '1990-04-13' to '13-04-1990'
  //   var thisDate = today.toISOString().split('T')[0].split('-');
  //   return [thisDate[2], thisDate[1], thisDate[0]].join("-");
  // }

  // getDaysArray(start: any, end: any) {
  //   for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) { arr.push(new Date(dt)); }
  //   return arr;
  // };
  getDaysArray(start: any, end: any) {
    var arr = [];
    let index = this.freeSpacesArray.findIndex(Start => Start.date.getDate() === new Date(start).getDate());
    while (this.freeSpacesArray[index].date.getDate() <= new Date(end).getDate()) {
      arr.push(this.freeSpacesArray[index]);
      index++;
    }
    return arr;
  }
}
