import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';

export interface formGroupGrid {
  title: string;
  cols?: string;
  formCols?: string;
  questions: QuestionBase<string | Date | number>[];
}

@Component({
  selector: 'app-sleeping-options',
  templateUrl: './sleeping-options.component.html',
  styleUrls: ['./sleeping-options.component.scss'],
})
export class SleepingOptionsComponent implements OnInit {
  public editFormObj: any;
  public editMode:boolean = false;
  public addSleepingNight: boolean = true;
  public addSleepingNightDirty: boolean = false;
  public addSleepingNightStyles = [
    { 'border-bottom': '1px solid #448ECD' },
    { 'border-bottom': '1px solid #448ECD', 'text-decoration': 'none', 'font-weight': '600' },
    { 'font-weight': '500', 'color': '#808080' }
  ]
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
  @ViewChild('filledNightsForm') filledNightsForm: FormContainerComponent;
  public indexToPatch: number = -1;
  filledNightsArray: {
    sleepingPlace: string;
    nightsCount: string | any;
    saveFor: string;
    peopleCount: string;
    amount: string;
    comments: string;
    optionsArr: any[];
  }[] = [

    ];

  formCols: number = 12;
  questions: QuestionBase<string | number>[] = [];

  changeDatesHandler(newDates: string) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    if (newDates && !newDates.includes('-')) return;
    const dates = newDates.split('-');
    const dateFormat1 = dates[0].split('/').reverse();
    dateFormat1[1] = (+dateFormat1[1] - 1).toString();
    dateFormat1[2] = (+dateFormat1[2]).toString();
    const dateFormat2 = dates[1].split('/').reverse();
    dateFormat2[1] = (+dateFormat2[1] - 1).toString();
    dateFormat2[2] = (+dateFormat2[2]).toString();
    let date1 = new Date(dateFormat1.join(','));
    let date2 = new Date(dateFormat2.join(','));

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    const newSleepingOptionsByDay = [];

    let newDate = new Date(date1.setDate(date1.getDate()));
    for (let i = 0; i <= totalDays; i++) {
      //להכניס שורה שמחליפה תאירך לסטרינג של תאריך לתצוגה
      const newDateString = `${newDate.getDate()}.${newDate.getMonth() + 2
        }.${newDate.getFullYear()}`;
      newSleepingOptionsByDay.push({
        day: newDateString,
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
            avialableSpaces: Math.floor(Math.random() * 90),
            type: 'גיחה',
            singleUnit: 'לנים',
          },
        ],
      });
      newDate = new Date(date1.setDate(date1.getDate() + 1));
    }
    this.sleepingOptionsByDay = newSleepingOptionsByDay;
  }

  constructor(
    private checkAvailabilityService: CheckAvailabilityService,
    private sleepingService: SleepingServiceService
  ) {
    this.questions = this.sleepingService.questions;
    this.changeDatesHandler(
      this.checkAvailabilityService.checkAvailabilltyValues.calendarInput
    );
  }
  public currentDate: any;

  addFilledNight(form: FormGroup) {
    let check = this.checkIfFilledNightExists(form.value);
    if (check !== undefined) {
      this.filledNightsArray[check].optionsArr.push(form.value);
      this.addSleepingNightDirty = true;
      this.addSleepingNight = false;
      return;
    }
    this.filledNightsArray.push(form.value);
    this.addSleepingNightDirty = true;
    this.addSleepingNight = false;
  }

  deleteFilledNight(index: number) {
    this.filledNightsArray.splice(index, 1);
  }
  deleteFilledNightOption(indexOfOption: number, index: number) {
    this.filledNightsArray[index].optionsArr.splice(indexOfOption, 1);
  }
  editFilledNight(index:number) {
    this.editFormObj = [this.filledNightsArray[index], index];
    this.addSleepingNight = true;
    this.addSleepingNightDirty = true;
    this.editMode = true;
  }
  public editFilledNightOption(optionIndex: number, index: number) {
    const item = this.filledNightsArray[index].optionsArr[optionIndex];
    this.editFormObj = [item, index, optionIndex];
    this.addSleepingNight = true;
    this.addSleepingNightDirty = true;
    this.editMode = true;
  }
  public updateFilledNightItem(item: any[]): void {
    const index = item[1];
    const newItem = item[0].value;
    const arr = [... this.filledNightsArray]
    if (item.length === 3) {
      const optionIndex = item[2];
      arr[index].optionsArr[optionIndex] = newItem;
      this.filledNightsArray = arr;
    } else {
      arr[index] = newItem;
      this.filledNightsArray = arr;
    }
    this.addSleepingNight = false;
    this.editFormObj = null;
    this.editMode = false;
  }
  public addSleepingNightHandler(): void {
    this.addSleepingNight = !this.addSleepingNight;
  }

  public checkIfFilledNightExists(form: any): number {
    let check: boolean;
    let index: number;
    if (this.filledNightsArray.length >= 1) {
      this.filledNightsArray.map((item, i) => {
        if (form.nightsCount.length === item.nightsCount.length) {
          check = this.compareValues(form.nightsCount, item.nightsCount);
          if (check) {
            index = i;
          }
        }
      });
    }
    return index;
  }
  public compareValues(first, second) {
    let check: any[] = [];
    for (let i = 0; i < first.length; i++) {
      if (first[i].nightNumber === second[i].nightNumber) {
        check.push(true);
      }
    }
    if (check.length === first.length) {
      return true;
    } else { return false; }
  }

  ngOnInit(): void { }
}
