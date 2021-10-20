import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { OrderService, TransportOrder, OrderEvent } from 'src/app/open-api';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralFormService {
  supplierList = [];
  itemsList = [];
  constructor(private orderService: OrderService, private squadAssembleService: SquadAssembleService) { }
  public details: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'supplier',
      label: 'ספק',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: this.supplierList,

      },
    }),
    new QuestionSelect({
      key: 'itemId',
      label: 'בחר פריט',
      type: 'select',
      value: '',
      validations: [Validators.required],
      inputProps: {
        options: this.itemsList,
      },
    }),

    new QuestionTextbox({
      key: 'quantity',
      label: 'כמות',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'peopleInTrip',
      label: 'משתתפים',
      value: this.squadAssembleService.peopleInTrip,
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'itemCost',
      label: 'מחיר',
      value: '',
      type: 'number',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingSupplier',
      label: 'חיוב ספק',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingCustomer',
      label: 'חיוב לקוח',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'total',
      label: 'סה"כ',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionSelect({
      key: 'startDate',
      icon: 'date_range',
      label: 'תאריך איסוף',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { label: 'יום 1', value: '1' },
          { label: 'יום 2', value: '2' },
          { label: 'יום 3', value: '3' },
          { label: 'יום 4', value: '4' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'endDate',
      icon: 'date_range',
      label: 'תאריך פיזור',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { label: 'יום 1', value: '1' },
          { label: 'יום 2', value: '2' },
          { label: 'יום 3', value: '3' },
          { label: 'יום 4', value: '4' },
        ],
      },
    }),
    new QuestionTextbox({
      key: 'startHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
      // inputProps: {
      //   // labelSize: 's5',
      // },
    }),
    new QuestionTextbox({
      key: 'endHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
    }),
  ]
  public comments: QuestionBase<string>[] = [
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: 6,
      rows: 6,
      offset: 1,
      value: '',
    }),
  ];
  public transport: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'pickUpLocation',
      label: 'מקום איסוף',
      value: '',
      icon: 'place',
      validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),

    new QuestionTextbox({
      key: 'pickUpAddress',
      label: 'כתובת איסוף',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
  ]
  public economy: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'servingTime',
      label: 'שעת הגשה',
      value: '',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),
    new QuestionTextbox({
      key: 'location',
      label: 'מיקום',
      value: '',
      icon: 'place',
      validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),
    new QuestionTextbox({
      key: 'regularDishesNumber',
      label: 'מספר מנות רגילות',
      value: '',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'vegetarianDishesNumber',
      label: 'מספר מנות צמחוניות',
      value: '',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'veganDishesNumber',
      label: 'מספר מנות טבעוניות',
      value: '',
      validations: [Validators.required],
    }),
  ]




  public questionGroups: QuestionGroup[] = [
    {
      key: 'details',
      questions: this.details,
      cols: 8,
    },
    {
      key: 'comments',
      questions: this.comments,
      hasButton: true,
      cols: 8,
    },
  ];
  
  public setInitialValues(
    questions: QuestionBase<string | number | Date | QuestionGroup>[],
    data: any
  ) {
    questions.map((control: QuestionBase<string | number | Date | QuestionGroup>) => {
      control.value = data[control.key]
      if (control.key === 'comments') {
        control.value = data;
      }
      // if (control.key === 'endHour') {
      //   var time = new Date(data[control.key]);
      //   control.value = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      //   // control.value = time;
      // }
    });
  }

  public setFormValues(data: any) {
    this.questionGroups.map((group: QuestionGroup) => {
      this.setInitialValues(group.questions, data);
    });
  }
}
