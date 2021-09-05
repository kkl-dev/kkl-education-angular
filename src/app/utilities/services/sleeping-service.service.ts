import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { CheckAvailabilityService } from './check-availability.service';
@Injectable({
  providedIn: 'root',
})
export class SleepingServiceService {
  nightsArray: {}[] = [];

  checkAvailabilltyValues: {
    sleepingPlace: string;
    calendarInput: string;
  } = { sleepingPlace: '', calendarInput: '' };

  questions: QuestionBase<string | number>[] = [

    new QuestionSelect({
      key: 'sleepingPlace',
      label: ' סוג לינה', 
      type: 'select',
      cols: '2',

      validations: [Validators.required],
      inputProps: {
        // labelLength: 'extraWide',
        options: [
          { key: 'בקתות', value: 'בקתות' },
          { key: 'גיחה', value: 'גיחה' },
          { key: 'אוהלים', value: 'אוהלים' },
        ],
      },
    }),

    new QuestionSelect({
      key: 'nightsCount',
      type: 'select',
      cols: '2',
      label: 'קבוצת גיל',
      inputProps: {
        options: [
          { key: '1', value: 'לילה 1' },
          { key: '2', value: 'לילה 2' },
          { key: '3', value: 'לילה 3' },
          { key: '4', value: 'לילה 4' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'saveFor',
      type: 'select',
      cols: '2',
      label: 'שריין עבור',
      inputProps: {
        options: [
          { key: 'מבוגרים', value: 'מבוגרים' },
          { key: 'נוער', value: 'נוער' },
          { key: 'מדריכים', value: 'מדריכים' },
          { key: 'חובשים', value: 'חובשים' },
        ],
      },
    }),
    new QuestionNumber({
      key: 'peopleCount',
      label: 'מספר לנים',
      value: 0,
      cols: '2',

      validations: [Validators.required],
    }),
    new QuestionNumber({
      key: 'amount',
      label: 'כמות',
      cols: '2',

      value: 0,
      validations: [Validators.required],
    }),
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      cols: '6',
      value: '',
    }),
  ];

  constructor(private checkAvailabiltyService: CheckAvailabilityService) {
    this.checkAvailabilltyValues = this.checkAvailabiltyService.checkAvailabilltyValues;
  }

  updateQuestions(
    questionValues: {
    sleepingPlace: string;
    nightsCount: string;
    saveFor: string;
    peopleCount: string;
    amount: string;
    comments: string;
  }) {

// this.questions.form.value=questionValues
    console.log(questionValues);
    
  }
}
