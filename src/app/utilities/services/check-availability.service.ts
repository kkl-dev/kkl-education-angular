import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TooltipDataModel } from 'src/app/screens/education-results/tooltip/tooltip.component';

export interface InfoCard {
  svgUrl: string;
  headline: string;
  subHeadline?: string;
  availability: TooltipDataModel[];
}

@Injectable({
  providedIn: 'root',
})
export class CheckAvailabilityService {
  
  checkAvailabilltyValues: {
    sleepingPlace: string;
    calendarInput: string;
    //calendar input value for development in real app it will redirect to search page if calendar input wasnt set in the search page
  } = { sleepingPlace: '', calendarInput: '19/09/2021-22/09/2021' };
    
  public facilitiesArray: InfoCard[] = [
    // {
    //   svgUrl: 'assets/images/stage.svg',
    //   headline: 'תאטרון',
    //   subHeadline: 'עד 320 משתתפים',
    //   availability: [
    //     {
    //       startingHour: 8,
    //       endingHour: 10,
    //       totalTime: 2,
    //       user: 'גנים',
    //     },
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'דני',
    //     },
    //     {
    //       startingHour: 19.75,
    //       endingHour: 24,
    //       totalTime: 4.25,
    //       user: 'דני',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/museum.svg',
    //   headline: 'תאטרון',
    //   subHeadline: 'עד 320 משתתפים',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'אורנים',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/classroom.svg',
    //   headline: 'תאטרון',
    //   subHeadline: 'עד 20 משתתפים',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'רתמים',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/football.svg',
    //   headline: 'מגרש ספורט',
    //   subHeadline: '',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'נחלאות',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/leafs.svg',
    //   headline: 'סיור במשתלה',
    //   availability: [],
    // },
    // {
    //   svgUrl: 'assets/images/student-hat.svg',
    //   headline: 'מרכז למידה',
    //   subHeadline: 'עד 40 משתתפים',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'ירושלים',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/climbing.svg',
    //   headline: 'תחנות הפעלה',
    //   subHeadline: 'עד 40 משתתפים',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'פתח תקווה',
    //     },
    //   ],
    // },
    // {
    //   svgUrl: 'assets/images/judaism.svg',
    //   headline: 'בתי כנסה',
    //   availability: [
    //     {
    //       startingHour: 14,
    //       endingHour: 15.25,
    //       totalTime: 1.25,
    //       user: 'בני ברק',
    //     },
    //   ],
    // },
  ];

  constructor() {}  

  saveCheackAvailabilltyValues(newFormValues: NgForm) {
    this.checkAvailabilltyValues = newFormValues.form.value;  
    console.log(this.checkAvailabilltyValues.calendarInput);
    
  }

  getNewFacilitiesArray(date: string) {
    return this.facilitiesArray;
  }
}