import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { LodgingReservation, TripInfo, UserService } from 'src/app/open-api';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';
import { SquadAssembleService } from '../squad-assemble/services/squad-assemble.service';

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
  public addSleepingNight: boolean = true;
  public addSleepingNightDirty: boolean = false;
  public addSleepingNightStyles = [
    { 'border-bottom': '1px solid #448ECD' },
    { 'border-bottom': '1px solid #448ECD', 'text-decoration': 'none', 'font-weight': '600' },
    { 'font-weight': '500', 'color': '#808080' }
  ]
 
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
  }[] = [];
   

  formCols: number = 12;
  questions: QuestionBase<string | number>[] = [];

  

  constructor(
    private checkAvailabilityService: CheckAvailabilityService, private sleepingService: SleepingServiceService, private squadAssembleService:SquadAssembleService ,private userService:UserService ) {
    //this.questions = this.sleepingService.questions;
    //this.changeDatesHandler(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
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
    if (this.indexToPatch > -1) {
      this.filledNightsArray[this.indexToPatch] = form.value;
    } else {
      this.filledNightsArray.push(form.value);
      //console.log(this.filledNightsArray);
    }
     this.squadAssembleService.savefilledNightsArray(this.filledNightsArray);
     console.log('filledNightsArray is: ',this.squadAssembleService.filledNightsArray);
    this.indexToPatch = -1;
    this.addSleepingNightDirty = true;
    this.addSleepingNight = false;
  }

  deleteFilledNight(index: number) {
    this.filledNightsArray.splice(index, 1);
  }
  deleteFilledNightOption(indexOfOption: number, index: number) {
    this.filledNightsArray[index].optionsArr.splice(indexOfOption, 1);
  }
  editFilledNight(form, index) {
    console.log(this.filledNightsForm)
    this.filledNightsForm.formGroup.patchValue(form);
    this.indexToPatch = index;
  }
  public editFilledNightOption(optionIndex: number, index: number) {
    const item = this.filledNightsArray[index].optionsArr[optionIndex];
    this.editFormObj = { ...item };

    console.log({ item });

    this.addSleepingNight = true;
    this.addSleepingNightDirty = true;
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
