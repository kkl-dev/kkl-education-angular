import {
  Component,
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
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('resultsForm') signupForm: NgForm;

  date: string | null = null;

  dateObj: { from: string; to: string } = { from: '', to: '' };
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();

  // dateObj:{from:string, to:string} ={from:'', to:''}
  freeSpacesArray1: FreeSpace[] = [];

  freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArrayTemp: FreeSpace[] = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArrayTemp.push({
        date: start,
        freeSpace: {
          cabins: Math.floor(Math.random() * 8),
          tents: Math.floor(Math.random() * 8),
          campgrounds: Math.floor(Math.random() * 8),

        },
      });
    }
    return freeSpacesArrayTemp;
  }

  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    // minDate: addDays(new Date(), 5),
    // maxDate: addDays(new Date(), 10),  
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray1,
  };

  public dateObjChanged(e: string) {
    
    if (e && e.includes('-')) {
      this.emitNewDates.emit(e);
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
  }

  public formOptions: { imgSrc: string; text: string; value: string }[] = [
    { imgSrc: 'assets/images/select-1.jpg', text: 'ציפורי', value: 'ציפורי' },
    { imgSrc: 'assets/images/select-2.jpg', text: 'לביא', value: 'לביא' },
    {
      imgSrc: 'assets/images/select-3.jpg',
      text: 'נס הרים',
      value: ' נס הרים',
    },
    { imgSrc: 'assets/images/select-4.jpg', text: 'יתיר', value: 'יתיר' },
  ];

  location: string = '';
  constructor(private checkAvailabillityService: CheckAvailabilityService) {
    this.dateObjChanged(
      this.checkAvailabillityService.checkAvailabilltyValues.calendarInput
    );
  
    this.location =
      this.checkAvailabillityService.checkAvailabilltyValues.sleepingPlace;
    this.freeSpacesArray1 = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2022, 11, 17)
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy', 
      closeOnSelected: true, 
      minDate: new Date(2018,3,5),  
      maxDate: new Date(2022,9,5),    
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray1,
    };
  }

  public getNewFreeSpace(){
    console.log('as');
    
  }


  ngOnInit(): void {}
}
