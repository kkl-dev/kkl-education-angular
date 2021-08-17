import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { subDays, addDays } from 'date-fns';
import { Locale, getYear } from 'date-fns';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  @ViewChild('educationForm') signupForm: NgForm | undefined;

  public checked = false;
  sleepingPlace: string = '';
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

  ngOnInit(): void {}

  public formOptions = [
    { imgSrc: 'assets/images/select-1.jpg', text: 'ציפורי', value: '1' },
    { imgSrc: 'assets/images/select-2.jpg', text: 'לביא', value: '2' },
    { imgSrc: 'assets/images/select-3.jpg', text: 'נס הרים', value: '31' },
    { imgSrc: 'assets/images/select-4.jpg', text: 'יתיר', value: '51' },
  ];

  date: string | null = null;
  dateObj: { from: string; to: string } = { from: '', to: '' };

  freeSpacesArray: FreeSpace[] = [];

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
    freeSpacesArray: this.freeSpacesArray,
  };

  public dateObjChanged(e: string) {
    if (e.includes('-')) {
      let tempDateArr: string[] = [];
      tempDateArr = e.split('-');
      console.log(tempDateArr);
      if (new Date(tempDateArr[0]) < new Date(tempDateArr[1])) {
        this.dateObj.from = tempDateArr[0];
        this.dateObj.to = tempDateArr[1];
      } else {
        this.dateObj.from = tempDateArr[1];
        this.dateObj.to = tempDateArr[0];
      }
    } else {
      console.log(e);

      this.dateObj.from = e;
      this.dateObj.to = '';
    }
  }

  hideSelectPlaceholder(sel: MatSelect) {
    console.log('asdasd');
    sel.placeholder = '';
  }

  showSelectPlaceholder(sel: MatSelect) {
    //check if no value
    console.log('asdasd');

    if (sel.value === '') {
      sel.placeholder = 'בחר מרכז שדה';
    }
  }

  printFormValues() {
    if (this.signupForm != undefined) {
      console.log(this.signupForm.form.value);
    }
  }
}
