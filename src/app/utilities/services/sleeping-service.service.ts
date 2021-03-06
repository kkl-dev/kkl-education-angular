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
        options: [
          { label: 'בקתות', value: 'בקתות' },
          { label: 'גיחה', value: 'גיחה' },
          { label: 'אוהלים', value: 'אוהלים' },
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
          { label: '1', value: 'לילה 1' },
          { label: '2', value: 'לילה 2' },
          { label: '3', value: 'לילה 3' },
          { label: '4', value: 'לילה 4' },
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
          { label: 'מבוגרים', value: 'מבוגרים' },
          { label: 'נוער', value: 'נוער' },
          { label: 'מדריכים', value: 'מדריכים' },
          { label: 'חובשים', value: 'חובשים' },
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
    this.checkAvailabilltyValues =
      this.checkAvailabiltyService.checkAvailabilltyValues;
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
