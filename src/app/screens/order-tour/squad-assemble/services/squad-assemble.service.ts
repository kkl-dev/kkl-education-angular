import { SquadGroupService } from '../components/squad-group/squad-group.service';
import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { SquadDetailsService } from '../components/squad-details/squad-details.service';
import { SquadBudgetService } from '../components/squad-budget/squad-budget.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SquadClientService } from '../components/squad-client/squad-client.service';
import { SquadNewClientService } from '../components/squad-new-client/squad-new-client.service';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { dateOptions } from 'src/mock_data/calendar';

@Injectable({
  providedIn: 'root',
})
export class SquadAssembleService {
  public $saveMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  freeSpacesArray: FreeSpace[] = [];

  formsArray: FormGroup[] = [];

  public freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArray = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArray.push({
        date: start,
        freeSpace: [
          {
            accomodationName: 'cabin',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'tent',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'room',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
        ],
      });
    }
    return freeSpacesArray;
  }

  public options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',

    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  constructor(
    private squadDetailsService: SquadDetailsService,
    private squadClientService: SquadClientService,
    private squadNewClientService: SquadNewClientService,
    private squadBudgetService: SquadBudgetService,
    private squadGroupService: SquadGroupService // private squadScheduleService : SquadSch
  ) {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2021, 11, 17)
    );
  }

  public scheduleQuestions: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tourName',
      label: '???? ??????????',
      value: '',
      rows: 4,
      validations: [Validators.required],
      inputProps: {},
    }),

    new QuestionSelect({
      key: 'fieldCenter',
      type: 'select',
      label: '???????? ??????',

      inputProps: {
        options: [
          { label: 'solid', value: '12123' },
          { label: 'great', value: '23' },
          { label: 'good', value: '123' },
          { label: 'unproven', value: '123123123' },
        ],
      },
      validations: [Validators.required],
    }),

    new QuestionCalendar({
      key: 'scheduleDates',
      label: '???????????? ????????',
      value: null,
      rows: 4,
      validations: [Validators.required],
      dateOptions: dateOptions,
      inputProps: {},
    }),

    new QuestionSelect({
      key: 'tourRegion',
      type: 'select',
      label: '?????????? ????????',

      inputProps: {
        options: [],
      },
    }),

    new QuestionTextarea({
      key: 'comments',
      label: '?????????? ??????????????',
      rows: 6,
    }),
  ];

  public customerFormInputs: QuestionBase<string>[] =
    this.squadClientService.questions;

  public newClient: QuestionGroup = {
    key: 'newClient',
    questions: this.squadNewClientService.questions,
  };

  public groupAssembleFormMixedInputs: QuestionBase<string | number>[] =
    this.squadGroupService.mixedQuestions;

  public groupAssembleFormInputs: QuestionBase<string>[] =
    this.squadGroupService.groupQuestions;

  public tourDetailsFormInputs: QuestionBase<string>[] =
    this.squadDetailsService.questions;

  public budgetQuestions: QuestionBase<string>[] =
    this.squadBudgetService.questions;

  public updateFormArray(form: FormGroup) {
    const index = this.formsArray.findIndex(
      (formItem) => form.controls == formItem.controls
    );
    if (index > -1) {
      this.formsArray[index] = form;
    } else {
      this.formsArray.push(form);
    }
  }

  public getSaveModeObs(): Observable<boolean> {
    return this.$saveMode.asObservable();
  }

  public emitSaveMode(value: boolean): void {
    this.$saveMode.next(value);
  }

  public getNewClientObs(): Observable<boolean> {
    return this.squadNewClientService.getNewClientObs();
  }
}
