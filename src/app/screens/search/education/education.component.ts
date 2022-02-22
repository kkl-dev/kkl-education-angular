import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
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
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {

  @ViewChild('educationForm') signupForm: NgForm;
  @ViewChild('container') container: ElementRef;
  @Output() emitFormValues: EventEmitter<NgForm> = new EventEmitter();

  checked = false;
  //sleepingPlace: any;
  forestCenterId: any;
  disableDates: boolean = true;
  disableContinueBtn = true;
  checkedSingleDay = false;
  routerLinkContinue = '/education/results';
  routerLinkContinueForOneDayTrip = '/education/order-tour/squad-assemble';
  AvailableDates!: AvailableAccomodationDate[];
  AcommodationTypes!: AccommodationType[];
  AcommodationType = 'בקתה';
  fieldForestCentersLookUp;
  date: string | null = null;
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[] = [];
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'dd/LL/yyyy',
    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2022,
    freeSpacesArray: this.freeSpacesArray,
  };

  constructor(public usersService: UserService, private router: Router, private _dialog: MatDialog, public tripService: TripService,
    private checkAvailabilltyService: CheckAvailabilityService,private spinner: NgxSpinnerService, private http:HttpClient ) {

    this.freeSpacesArray = this.freeSpacesArrayGenarator(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    this.options = {
      firstCalendarDay: 0,
      format: 'dd/LL/yyyy',
      closeOnSelected: true,
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    debugger;
    this.getLookupFieldForestCenters();
  }

 
  
  getLookupFieldForestCenters(){
    debugger;
     this.usersService.getLookupFieldForestCenters().subscribe(res=>{
        this.fieldForestCentersLookUp=res;
        this.fieldForestCentersLookUp = res.filter(aco => aco.accommodationList.length > 0);
        this.tripService.formOptions=this.fieldForestCentersLookUp;
        console.log('fieldForestCentersLookUp after filter is: ',this.tripService.formOptions)
        this.forestCenterId = this.tripService.centerField.id.toString() || null;
        if (this.forestCenterId != 0 && this.forestCenterId != null) {
          this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
          this.sleepingDates = this.tripService.sleepingDates;
          this.disableContinueBtn = false;
        }
     },(err)=>{
       console.log(err);
     })
  }

  //end test
 

  selectChange(event: any) {
    debugger;
    this.tripService.centerField = this.tripService.formOptions.filter((el: { id: number; }) => el.id === parseInt(event.value))[0];
    this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString());
    this.disableDates = false;
  }

  getAvailableDates(fromDate: string, tillDate: string) {
    fromDate = fromDate.substring(0, 10);
    tillDate = tillDate.substring(0, 10);
    // tillDate = '2021-11-30'
    this.spinner.show();
    this.usersService.getAvailableAccomodationDates(this.tripService.centerField.id, fromDate, tillDate).subscribe(
      response => {
        this.spinner.hide();
        console.log(response)
        this.AvailableDates = response;
        this.AvailableDates.forEach(element => element.freeSpace.forEach(element => { if (element.availableBeds === undefined) { element.availableBeds = 0; } }));
        // this.freeSpacesArray = this.freeSpacesArrayGenaratorFromServer(new Date(fromDate), new Date(tillDate));
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
        this.disableDates = false;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  freeSpacesArrayGenaratorFromServer(start: Date, end: Date) {
    let i = 0;
    let freeSpacesArray = [];
    start.setDate(start.getDate() - 1);

    while (start < end && i <= this.AvailableDates.length) {
      // while (start < end && i < this.AvailableDates.length) {
      // for (var j in this.AvailableDates[i].freeSpace) {
      freeSpacesArray.push({
        date: start,
        freeSpace: this.AvailableDates[i].freeSpace
        // [
        //   {
        //     accomodationName: this.AvailableDates[i].freeSpace[j].accomodationName,
        //     availableBeds: this.AvailableDates[i].freeSpace[j].availableBeds
        //   }
        // ]
      });
      // }
      start = new Date(start.setDate(start.getDate() + 1));
      i++;
    }
    return freeSpacesArray;
  }

  freeSpacesArrayGenarator(start: Date, end: Date) {
    //const i = 0;
debugger;
    let freeSpacesArray = [];
    var x = new Date(end.setDate(end.getDate() - 1))
    start.setDate(start.getDate() - 1);
    while (start < x) {
      freeSpacesArray.push({
        date: new Date(start.setDate(start.getDate() + 1)),
        freeSpace: [
          {
            accomodationName: 'cabin',
            availableBeds: + Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'tent',
            availableBeds: + Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'room',
            availableBeds: + Math.floor(Math.random() * 8).toString(),
          }
        ]
      });
    }
    return freeSpacesArray;
  }

  newDateRecived(newDate: any) {
    debugger;
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
    debugger;
    console.log(prevDate);

  }

  newSleepingPlaceRecived(sleepingPlace: any) {
    debugger;
    console.log('sleepingPlace: ' + sleepingPlace);
    this.AcommodationTypes = sleepingPlace;
  }

  public dateObjChanged(e: string) {
debugger;
    if (e.includes('-')) {
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      //change date from obj to new Date format
      const dateFormat1 = tempDateArr[0].split('/').reverse();
      dateFormat1[1] = (+dateFormat1[1] ).toString();
      dateFormat1[2] = (+dateFormat1[2]).toString();
      const dateFormat2 = tempDateArr[1].split('/').reverse();
      dateFormat2[1] = (+dateFormat2[1] ).toString();
      dateFormat2[2] = (+dateFormat2[2]).toString();
      if (new Date(dateFormat1.join(',')) < new Date(dateFormat2.join(','))) {
        this.sleepingDates.from = tempDateArr[0];
        this.sleepingDates.till = tempDateArr[1];
      } else {
        this.sleepingDates.from = tempDateArr[1];
        this.sleepingDates.till = tempDateArr[0];
      }
      console.log(this.container);
      this.container.nativeElement.focus();
      //this.closeCalendarHandler(e);
      this.disableContinueBtn = false;
    } else {

      this.sleepingDates.from = e;
      this.sleepingDates.till = '';
    }
    this.tripService.sleepingDates = this.sleepingDates;
  }

  closeCalendarHandler(event: any) {
    debugger;
    console.log('asd');
  }

  AvailableDaysChecking() {
    if(!this.forestCenterId || !this.sleepingDates.from || !this.sleepingDates.till )
    return false;
    let from = this.sleepingDates.from;
    let till = this.sleepingDates.till;
    let fromArr = from.split("/");
    let tillArr = till.split("/");
    from = fromArr[1] + '-' + fromArr[0] + '-' + fromArr[2];
    till = tillArr[1] + '-' + tillArr[0] + '-' + tillArr[2],
      this.tripService.dateRange = this.getDaysArray(new Date(from), new Date(till))
    var flag = true;
    for (var i in this.tripService.dateRange) {
      // let typeAmount = this.tripService.dateRange[i].freeSpace.find(element => element.accomodationName === this.AcommodationTypes);
      // if (typeAmount.availableBeds === 0) { flag = false; }
      //if (!flag) { console.log('אחד הימים בטווח התאריכים אינו פנוי'); return flag; }
      if (!flag) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '300px',
          data: { message: 'אחד  הימים בטווח התאריכים אינו פנוי', content: '', leftButton: 'המשך' }
        });  return flag;
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
    debugger;
    if (this.signupForm != undefined && this.AvailableDaysChecking()) {
      this.emitFormValues.emit(this.signupForm);
      this.checkAvailabilltyService.saveCheackAvailabilltyValues(
        this.signupForm
      );
      if(this.sleepingDates.from != this.sleepingDates.till){
        this.tripService.isOneDayTrip=false
        this.router.navigate([this.routerLinkContinue])
      }   
      else{
        this.tripService.isOneDayTrip=true;
        this.router.navigate([this.routerLinkContinueForOneDayTrip])
      }
      this.router.navigate([this.routerLinkContinue])
    }
  }
  singleDayTrip() {
    if (this.checkedSingleDay) {
      this.routerLinkContinue = '/education/my-tours';
    }
  }
  convertDate(today: any) {
    //function to change date format '1990-04-13' to '13-04-1990'
    var thisDate = today.toISOString().split('T')[0].split('-');
    return [thisDate[2], thisDate[1], thisDate[0]].join('-');
  }

  //   getDaysArray(start: any, end: any) {
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
  //listDays = this.getDaysArray(this.sleepingDates.from, this.sleepingDates.till);
}
