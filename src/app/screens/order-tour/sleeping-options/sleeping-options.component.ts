import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
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

  filledNightsArray:{sleepingPlace: string, nightsCount: string, saveFor: string, peopleCount: string, amount: string,comments:string}[]=[]



  formCols: number = 8;
  questions: QuestionBase<string | number>[] = [

  ];

  changeDatesHandler(newDates: string) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const dates = newDates.split('-');
    let date1 = new Date(dates[0]);
    let date2 = new Date(dates[1]);
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
      const newDateString = `${newDate.getDate()}.${
        newDate.getMonth() + 1
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

  constructor(private checkAvailabilityService:CheckAvailabilityService, private sleepingService:SleepingServiceService) {
   this.questions=this.sleepingService.questions
  }

  updateFilledNightsArray(e){
    console.log(e);
this.filledNightsArray.push(e)
  }

  ngOnInit(): void {}
}
