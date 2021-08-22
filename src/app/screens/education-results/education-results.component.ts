import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TooltipDataModel } from './tooltip/tooltip.component';

export interface InfoCard {
  svgUrl: string;
  headline: string;
  subHeadline?: string;
  availability: TooltipDataModel[];
}

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})
export class EducationResultsComponent implements OnInit {
  public availabilityItemsArray = [
    { date: '15.06.21', text: 'זמינות יום 1' },
    { date: '16.06.21', text: 'זמינות יום 2' },
    { date: '17.06.21', text: 'זמינות יום 3' },
  ];

  public chosenDate = 0;

  sleepingOptionsByDay: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }[];
  }[] = [
    {
      day: '15.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 6,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 1670,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '16.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 670,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '17.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 46,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 32,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 10,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '18.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 120,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
    {
      day: '19.6.21',
      options: [
        {
          svgUrl: 'assets/images/cabin.svg',
          sleepingAreas: 2,
          avialableSpaces: 16,
          type: 'בקתות',
          singleUnit: 'בבקתה',
        },
        {
          svgUrl: 'assets/images/tent.svg',
          sleepingAreas: 4,
          avialableSpaces: 36,
          type: 'אוהלים',
          singleUnit: 'באוהל',
        },
        {
          svgUrl: 'assets/images/camp.svg',
          sleepingAreas: 1,
          avialableSpaces: 120,
          type: 'גיחה',
          singleUnit: 'לנים',
        },
      ],
    },
  ];

  public changeDate(newDate: number) {
    this.chosenDate = newDate;
  }

  emitCurrentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
  }

  public facilitiesArray: InfoCard[] = [
    {
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        {
          startingHour: 8,
          endingHour: 10,
          totalTime: 2,
          user: 'גנים',
        },
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'יוסי',
        },
        {
          startingHour: 19.75,
          endingHour: 24,
          totalTime: 4.25,
          user: 'יוסי',
        },
      ],
    },
    {
      svgUrl: 'assets/images/museum.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'אורנים',
        },
      ],
    },
    {
      svgUrl: 'assets/images/classroom.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 20 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'רתמים',
        },
      ],
    },
    {
      svgUrl: 'assets/images/football.svg',
      headline: 'מגרש ספורט',
      subHeadline: '',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'נחלאות',
        },
      ],
    },
    {
      svgUrl: 'assets/images/leafs.svg',
      headline: 'סיור במשתלה',
      availability: [],
    },
    {
      svgUrl: 'assets/images/student-hat.svg',
      headline: 'מרכז למידה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'ירושלים',
        },
      ],
    },
    {
      svgUrl: 'assets/images/climbing.svg',
      headline: 'תחנות הפעלה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'פתח תקווה',
        },
      ],
    },
    {
      svgUrl: 'assets/images/judaism.svg',
      headline: 'בתי כנסה',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'בני ברק',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public onClick() {
    this.router.navigateByUrl('education/order-tour/squad-assemble');
  }
}
