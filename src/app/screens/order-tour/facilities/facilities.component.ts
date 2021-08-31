import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { InfoCard } from '../../education-results/education-results.component';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  public timesArray: Array<string | number> = [];

  constructor() { }

  ngOnInit(): void {
    this.fillTimes();
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
      inputProps: { options: [{ key: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'area',
      label: 'אזור',
      validations: [Validators.required],
      inputProps: { options: [{ key: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'typeOfActivity',
      label: 'סוג פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ key: '', value: '' }] }
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
  
  ];

}
