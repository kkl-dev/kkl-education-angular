import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { TripService } from 'src/app/services/trip.service'
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { TripInfo, UserService } from 'src/app/open-api';

@Injectable({
  providedIn: 'root',
})
export class SquadAssembleService {
  freeSpacesArray: FreeSpace[] = [];
  tripInfo: TripInfo = {}
  formsArray: FormGroup[] = [];
  filledNightsArray :[];

  freeSpacesArrayGenarator(start: Date, end: Date) {
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
  // cabins: this.AvailableDates[i].availableBedsCabin!,
  // tents: this.AvailableDates[i].availableBedsTent!,
  // campgrounds: this.AvailableDates[i].availableBedsCamping!,
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

  private genderArray: QuestionNumber[] = [
    new QuestionNumber({
      key: 'boys',
      label: 'בנים',
      type: 'number',
      cols: 2,
      offset: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'girls',
      label: 'בנות',
      type: 'number',
      cols: 2,
      rows: 4,
    }),
  ];

  constructor(private tripService: TripService, public usersService: UserService) {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2021, 11, 17)
    );
  }

  //public timeAndNameFormInputs: QuestionBase<string | Date>[] = [
  public timeAndNameFormInputs: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tripDescription',
      label: 'שם הטיול',
      value: '',
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelSize: 's2',
      },
    }),

    new QuestionSelect({
      key: 'centerField',
      type: 'select',
      label: 'מרכז שדה',
      inputProps: {
        options: this.tripService.fieldForestCenters,
        labelSize: 's3',
      },
      validations: [Validators.required],
    }),
    // 
    // [
    //   { key: 'solid', value: '12123' },
    //   { key: 'great', value: '23' },
    //   { key: 'good', value: '123' },
    //   { key: 'unproven', value: '123123123' },
    // ]
    // new QuestionCalendar({
    //   key: 'dates',
    //   label: 'תאריכי לינה',
    //   value: null,
    //   rows: 4,
    //   validations: [Validators.required],
    //   inputProps: {
    //     labelSize: 's3',
    //   },
    // }),
    new QuestionCalendar({
      key: 'tripStart',
      type: 'calendar',
      label: 'תאריך התחלה',
      value: null,
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelSize: 's3',
      },
    }),

    new QuestionCalendar({
      key: 'tripEnding',
      type: 'calendar',
      label: 'תאריך סיום',
      value: null,
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelSize: 's3',
      },
    }),

  ];

  public customerFormInputs: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'customerName',
      label: 'הקלד לקוח רצוי',
      cols: 2,
      value: '',
      validations: [Validators.required],
      inputProps: {
        labelSize: 's8',
      },
    }),

    new QuestionSelect({
      key: 'customer',
      type: 'select',
      label: 'הכול',
      inputProps: {
        labelSize: 's1',
        options:this.tripService.customers ,
      },
    }),
    // [
    //   { key: 'שם נוסף', value: 'שם נוסף' },
    //   { key: 'עוד לקוח', value: 'עוד לקוח' },
    //   { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
    //   { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
    // ]
    new QuestionSelect({
      key: 'payerName',
      label: 'לקוח משלם',
      type: 'select',
      fullWidth: true,
      inputProps: {
        labelSize: 's3',
        options: [
          { key: 'שם נוסף', value: 'שם נוסף' },
          { key: 'עוד לקוח', value: 'עוד לקוח' },
          { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
          { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
        ],
      },
    }),

    new QuestionBase({
      key: 'contact',
      isGroup: true,
      fullWidth: true,
      rows: 15,
      group: {
        key: 'contact',
        cols: 1,
        rows: 3,
        questions: [
          new QuestionTextbox({
            key: 'contactName',
            label: 'איש קשר',
            inputProps: {
              labelSize: 's1',
            },
            value: 'tal'
          }),

          new QuestionTextbox({
            key: 'contactPhone',
            label: 'נייד איש קשר',
            type: 'text',
            validations: [Validators.required],
            inputProps: {
              labelSize: 's3',
            },
            value: '0525888888'
          }),
          new QuestionTextbox({
            key: 'contactEmail',
            label: 'מייל',
            type: 'text',
            validations: [Validators.required],
            inputProps: {
              labelSize: 's1',
            },
            value: 'test@gmail.com'
          }),
        ],
      },
    }),
  ];

  public groupAssembleFormMixedInputs: QuestionBase<string | number>[] = [
    new QuestionSelect({
      key: 'ageGroup',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'קבוצת גיל',
      inputProps: {
        options: this.tripService.ageGroup,
      },
    }),
    // this.tripService.ageGroup
    // [
    //   { key: '1', value: '1' },
    //   { key: 'עוד לקוח', value: '10+' },
    //   { key: 'לקוח מספר שלוש', value: '20+' },
    //   { key: 'לקוח מספר ארבע', value: '30+' },
    // ],
    new QuestionNumber({
      key: 'numAccompanied',
      label: 'מלווים',
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'numAdultAndYoung',
      label: 'נוער / מבוגרים',
      offset: 1,
      cols: 2,
      rows: 4,
      inputProps: {
        labelSize: 'xl4',
      },
    }),
    new QuestionNumber({
      key: 'numDrivers',
      label: 'נהגים',
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'numGuides',
      label: 'מדריכים',
      offset: 1,
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'numAccompaniedAndGuide',
      label: 'חובשים',
      cols: 2,
      rows: 4,
      offset: 3,
    }),
  ];

  public groupAssembleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 3,
      label: 'קבוצת גיל',
      inputProps: {
        options: this.tripService.ageGroup,
      },
    }),
    // [
    //   { key: '1', value: '1' },
    //   { key: 'עוד לקוח', value: '10+' },
    //   { key: 'לקוח מספר שלוש', value: '20+' },
    //   { key: 'לקוח מספר ארבע', value: '30+' },
    // ]
    new QuestionBase({
      key: 'participants',
      fullWidth: true,
      rows: 5,
      isGroup: true,
      group: {
        key: 'participants',
        header: { text: 'נוער / מבוגרים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'chaperones',
      fullWidth: true,
      rows: 5,
      isGroup: true,
      group: {
        key: 'chaperones',
        header: { text: 'מלווים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'instructors',
      isGroup: true,
      fullWidth: true,
      rows: 5,
      group: {
        key: 'instructors',
        header: { text: 'מדריכים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'medics',
      isGroup: true,
      fullWidth: true,
      rows: 5,
      group: {
        key: 'medics',
        header: { text: 'חובשים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),
  ];

  public tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'attribute',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
        labelSize: 's4',
         options: this.tripService.attributes,
       
      },
    }),
    // [
    //   { key: 'פרומלי', value: 'פרומלי' },
    //   { key: 'בלתי פורמלי', value: 'בלתי פורמלי' },
    //   { key: 'מעוף', value: 'מעוף' },
    //   { key: 'חו"ל', value: 'חו"ל' },
    //   { key: 'הנהלת אגף', value: 'הנהלת אגף' },
    // ]
    new QuestionSelect({
      key: 'activityType',
      label: 'סוג הפעילות',
      type: 'select',
      inputProps: {
        labelSize: 's4',
         options: this.tripService.activityByAttribute,
       
      },
    }),
    // [
    //   { key: 'אירוח אכסנייה', value: 'אירוח אכסנייה' },
    //   { key: 'מחזון להגשמה', value: 'מחזון להגשמה' },
    // ]
    new QuestionRadio({
      key: 'departmentId',
      label: 'מחלקה',
      custom: true,
      value: '1',
      rows: 4,
      inputProps: {
        options: [
          { key: 'ישראל', value: '1' },
          { key: 'חו"ל', value: '8' },
        ],
      },
    }),

    
    // new QuestionRadio({
    //   key: 'tripLocation',
    //   label: 'מחלקה',
    //   custom: true,
    //   value: 'ישראל',
    //   rows: 4,
    //   inputProps: {
    //     options: [
    //       { name: 'ישראל', id: 'ישראל' },
    //       { name: 'חו"ל', id: 'חו"ל' },
    //     ],
    //   },
    // }),

    new QuestionRadio({
      custom: true,
      key: 'insideCenterFieldId',
      label: 'פנים/חוץ מרכז שדה',
      value: '1',
      rows: 4,
      inputProps: {
        options: [
          { key: 'פנים', value: '1' },
          { key: 'חוץ', value: '2' },
        ],
      },
    }),

    // new QuestionRadio({
    //   custom: true,
    //   key: 'tripCenter',
    //   label: 'פנים/חוץ מרכז שדה',
    //   value: 'ישראל',
    //   rows: 4,
    //   inputProps: {
    //     options: [
    //       { name: 'פנים', id: 'פנים' },
    //       { name: 'חוץ', id: 'חוץ' },
    //     ],
    //   },
    // }),

    new QuestionTextarea({
      key: 'commentManager',
      label: 'הערות מנהליות',
      rows: 6,
    }),
  ];

  
   

  updateFormArray(form: FormGroup) {
    const index = this.formsArray.findIndex(
      (formItem) => form.controls == formItem.controls
    );
    if (index > -1) {
      this.formsArray[index] = form;
      //console.log('fonund');
    } else {
      //console.log('else');
      this.formsArray.push(form);
    }

    console.log(this.formsArray);
  }

  savefilledNightsArray(array){
    this.filledNightsArray= array;
    console.log('I am service: ',this.filledNightsArray);
  }
}
