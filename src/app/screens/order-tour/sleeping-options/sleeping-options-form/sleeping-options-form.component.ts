import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { getYear } from 'date-fns';

@Component({
  selector: 'app-sleeping-options-form',
  templateUrl: './sleeping-options-form.component.html',
  styleUrls: ['./sleeping-options-form.component.scss'],
})
export class SleepingOptionsFormComponent implements OnInit {
  @ViewChild('resultsForm') signupForm: NgForm | undefined;
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();
  date: string = '';
  public formOptions: { imgSrc: string; text: string; value: string }[] = [
    { imgSrc: 'assets/images/userImage.jpg', text: 'ציפורי', value: '1' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'לביא', value: '1' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'נס הרים', value: '1' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'יתיר', value: '1' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'שוני', value: '1' },
  ];

  freeSpacesArray: FreeSpace[] = [];
  location: string = '';
  constructor() {
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
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  public dateObjChanged(e: string) {
    if (e.includes('-')) this.emitNewDates.emit(e);
    
  }

  ngOnInit(): void {}
}
