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
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';

@Component({
  selector: 'app-sleeping-options-form',
  templateUrl: './sleeping-options-form.component.html',
  styleUrls: ['./sleeping-options-form.component.scss'],
})
export class SleepingOptionsFormComponent implements OnInit {
  @ViewChild('resultsForm') signupForm: NgForm;
  @Output() emitNewDates: EventEmitter<string> = new EventEmitter();
  date: string = '';
  public formOptions: { imgSrc: string; text: string; value: string }[] = [
    { imgSrc: 'assets/images/userImage.jpg', text: 'ציפורי', value: 'ציפורי' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'לביא', value: 'לביא' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'נס הרים', value: 'נס הרים' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'יתיר', value: 'יתיק' },
    { imgSrc: 'assets/images/userImage.jpg', text: 'שוני', value: 'שוני' },
  ];

  freeSpacesArray: FreeSpace[] = [];
  location: string = '';




  constructor(private checkAvailabilityService:CheckAvailabilityService) {
    
    this.location=this.checkAvailabilityService.checkAvailabilltyValues.sleepingPlace
    this.date=this.checkAvailabilityService.checkAvailabilltyValues.calendarInput
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2022, 11, 17)
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',

      closeOnSelected: true,
      minDate: new Date(),
      maxDate: new Date(2022, 11, 17),
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
