import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { InfoCard } from '../../education-results/education-results.component';
import { INITIAL_EVENTS } from './calendar/event-utils';
import { EventInput } from '@fullcalendar/angular';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  public eventsArr: EventInput[] = [...INITIAL_EVENTS];
  public closeModal$: Observable<string>;
  public calendarEventsArr$: Observable<EventInput[]>;
  public timesArray: Array<string | number> = [];
  public hiddenElements: any = { facilities: false, activities: false };
  public TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  constructor(private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.fillTimes();
    this.calendarEventsArr$ = this.facilitiesService.getCalendarEventsArr();
    this.closeModal$ = this.facilitiesService.getCloseModalObs();
  }

  public addToCalendar(event: any): void {
    const tmpObj: EventInput = {
      id: `${this.eventsArr.length}`,
      title: event.title,
      start: this.TODAY_STR + `T${event.start}:00`,
      end: this.TODAY_STR + `T${event.end}:00`,
      backgroundColor: event.backgroundColor,
      textColor: 'black',
      editable: true,
      className: 'border-activities'
    }
    this.eventsArr.push(tmpObj);
    this.facilitiesService.updateCalendarEventsArr(tmpObj);
  }
  public openModal(args: string): void {
    this.facilitiesService.closeModal(args);
  }
  public fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }
  public colors = { green: '#37C56B', blue: '#448ECD' }
  // arrays
  public timeLineArray: Array<object> = [
    {
      title: 'ארוחת צהריים', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/roast-chicken.svg', color: this.colors.green
    },
    {
      title: 'מטבח שדה', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/kitchen.svg', color: this.colors.blue
    },
    {
      title: 'התייצבות', startTime: '10:00', endTime: '11:00',
      iconSrc: 'assets/images/finish-flag-1.svg', color: this.colors.green, secondIcon: 'bus'
    },
  ];
  public formArray: QuestionBase<string | number>[] = [
    new QuestionSelect({
      key: 'durationOfActivity',
      label: 'משך פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'area',
      label: 'אזור',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'typeOfActivity',
      label: 'סוג פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionTextbox({
      key: 'search',
      label: 'חפש פעילות',
      value: '',
      validations: [Validators.required]
    }),
  ];
  public facilitiesArray: InfoCard[] = [
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'ירושלים',
        },
      ],
    },
    // --- length 5 ---
    {
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
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
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        {
          startingHour: 14,
          endingHour: 15.25,
          totalTime: 1.25,
          user: 'ירושלים',
        },
      ],
    },
  ];
  public activitiesArray: InfoCard[] = [
    {
      svgUrl: 'assets/images/fruits.svg',
      headline: 'ארוחת ערב',
    },
    {
      svgUrl: 'assets/images/roast-chicken.svg',
      headline: 'ארוחת צהריים',
    },
    {
      svgUrl: 'assets/images/restaurant.svg',
      headline: 'ארוחת בוקר',
    },
    {
      svgUrl: 'assets/images/alarm.svg',
      headline: 'השכמה',
    },
    {
      svgUrl: 'assets/images/bus-with-flag.svg',
      headline: 'התייצבות',
    },
    {
      svgUrl: 'assets/images/fruits.svg',
      headline: 'ארוחת ערב',
    },
    {
      svgUrl: 'assets/images/alarm.svg',
      headline: 'השכמה',
    },
  ];
  public upComingActivitiesArray: ActivitiesCardInterface[] = [
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
  ];
}
