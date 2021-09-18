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
  @ViewChild('filledNightsForm') filledNightsForm: FormContainerComponent;

 
  public indexToPatch: number = -1;
  filledNightsArray: {
    sleepingPlace: string;
    nightsCount: string;
    saveFor: string;
    peopleCount: string;
    amount: string;
    comments: string;
  }[] = [
    {
      amount: '3',
      comments: 'הערה חדשה',
      nightsCount: 'לילה 1',
      peopleCount: '3',
      saveFor: 'מבוגרים',
      sleepingPlace: 'גיחה',
    },
  ];

  formCols: number = 12;
  questions: QuestionBase<string | number>[] = [];

  constructor(
    private checkAvailabilityService: CheckAvailabilityService, private sleepingService: SleepingServiceService) {
    //this.questions = this.sleepingService.questions;
    //this.changeDatesHandler(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
  }

  addFilledNight(form) {
    if (this.indexToPatch > -1) {
      this.filledNightsArray[this.indexToPatch] = form.value;
    } else {
      this.filledNightsArray.push(form.value);
    }
    this.indexToPatch = -1;
    this.filledNightsForm.formGroup.reset();
  }

  deleteFilledNight(index: number) {
    this.filledNightsArray.splice(index, 1);
  }
  editFilledNight(form, index) {
    this.filledNightsForm.formGroup.patchValue(form);
    this.indexToPatch = index;
  }

  ngOnInit(): void {}
}
