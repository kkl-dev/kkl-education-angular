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
import { UserService } from '../../../api/api/user.service';
import { TripService } from '../../../services/trip.service'
import { AcommodationType, AvailableDate, FieldForestCenter, SearchAvailableDatesOptions } from 'src/app/api';
import { FakeService } from 'src/app/services/fake.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  @ViewChild('educationForm') signupForm: NgForm;
  @Output() emitFormValues: EventEmitter<NgForm> = new EventEmitter();
  public checked = false;
  sleepingPlace: string = '';
  disableDates = true;
  disableContinueBtn = true;
  checkedSingleDay = false;
  routerLinkContinue = '/education/results'
  formOptions!: FieldForestCenter[];
  AvailableDates!: AvailableDate[];
  AcommodationTypes!: AcommodationType[];
  SearchAvailableDatesOptionsRequestBody = {} as SearchAvailableDatesOptions;

  constructor(public usersService: UserService, public tripService: TripService, 
    private checkAvailabilltyService: CheckAvailabilityService, public fakeApi: FakeService) {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2021, 11, 17)
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',

      closeOnSelected: true,
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray,
    };
  }

  ngOnInit() {
    this.getLookupFieldForestCenters();
    this.getLookupAcommodationType();
  }

  getLookupFieldForestCenters() {
        //get forest center fake
        this.fakeApi.getForestCenter().subscribe((forestCenters: any) => {
          if (forestCenters) {
            console.log('forest Centers', { forestCenters });
            this.formOptions = forestCenters;
          } else {
            console.log('no data in forest center');    
          }
        },
          error => {
            console.log({ error })
          });
    //yak del to get an array
    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     this.formOptions = response;
    //   },
    //   error => console.log(error),       // error
    //   () => console.log('completed')     // complete
    // )
  }

  getLookupAcommodationType() {
    this.usersService.getLookupAcommodationType().subscribe(
      response => {
        this.AcommodationTypes = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  selectChange(event: any) {
    this.tripService.centerField = this.formOptions.filter((el: { id: number; }) => el.id === parseInt(event.value))[0];
    this.getAvailableDates();
    this.disableDates = false;
  }

  getAvailableDates() {
    //request body to get available dates
    this.SearchAvailableDatesOptionsRequestBody.FieldForestCenter = this.tripService.centerField;
    this.SearchAvailableDatesOptionsRequestBody.fromDate = this.convertDate(new Date());
    var tillDate = new Date(new Date().setMonth(new Date().getMonth() + 4))
    this.SearchAvailableDatesOptionsRequestBody.tillDate = this.convertDate(tillDate);
    this.usersService.getAvailableDates(this.SearchAvailableDatesOptionsRequestBody).subscribe(
      response => {
        console.log(response)
        this.AvailableDates = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  date: string | null = null;
  dateObj: { from: string; to: string } = { from: '', to: '' };

  freeSpacesArray: FreeSpace[] = [];


  freeSpacesArrayGenarator(start: Date, end: Date) {
    let i = 0;
    let freeSpacesArrayTemp: FreeSpace[] = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArrayTemp.push({
        date: start,
        freeSpace: [
          ['בקתה', Math.floor(Math.random() * 8).toString()],
          ['אוהל', Math.floor(Math.random() * 8).toString()],
          ['קאמפ', Math.floor(Math.random() * 8).toString()], 
          ['חדר', Math.floor(Math.random() * 8).toString()]
        ]
      });
      i++;
    }
    return freeSpacesArrayTemp;
  }
  // cabins: this.AvailableDates[i].availableBedsCabin!,
  // tents: this.AvailableDates[i].availableBedsTent!,
  // campgrounds: this.AvailableDates[i].availableBedsCamping!,
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',

    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };


  
  newDateRecived(newDate:any){
    console.log(newDate); 
    
  }
  prevDateRecived(prevDate:any){
    console.log(prevDate); 
    
  }
  
  newSleepingPlaceRecived(sleepingPlace:any){
    console.log(sleepingPlace); 
    
  }

  public dateObjChanged(e: string) {
    if (e.includes('-')) {
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      if (new Date(tempDateArr[0]) < new Date(tempDateArr[1])) {
        this.dateObj.from = tempDateArr[0];
        this.dateObj.to = tempDateArr[1];
      } else {
        this.dateObj.from = tempDateArr[1];
        this.dateObj.to = tempDateArr[0];
      }
    } else {

      this.dateObj.from = e;
      this.dateObj.to = '';
    }
    this.AvailableDaysChecking();
    this.disableContinueBtn = false;
    this.tripService.dateObj = this.dateObj;
  }

  AvailableDaysChecking() {
    let index = this.freeSpacesArray.findIndex(start => start.date.getDate() === new Date(this.dateObj.from).getDate());
    while (this.freeSpacesArray[index].date.getDate() !== new Date(this.dateObj.to).getDate()) {
      // if(this.freeSpacesArray[index].freeSpace)
    }
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
    if (this.signupForm != undefined) {
      this.emitFormValues.emit(this.signupForm);
      this.checkAvailabilltyService.saveCheackAvailabilltyValues(this.signupForm)
    }
  }
  singleDayTrip() { if (this.checkedSingleDay) { this.routerLinkContinue = '/education/my-tours' } }
  convertDate(today: any) {//function to change date format '1990-04-13' to '13-04-1990'
    var thisDate = today.toISOString().split('T')[0].split('-');
    return [thisDate[2], thisDate[1], thisDate[0]].join("-");
  }
  getDaysArray(start: any, end: any) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) { arr.push(new Date(dt)); }
    return arr;
  };
  listDays = this.getDaysArray(this.dateObj.from, this.dateObj.to);
}
