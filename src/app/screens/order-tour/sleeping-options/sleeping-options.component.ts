import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { AccommodationType, LodgingReservation, ParticipantType, TripInfo, UserService } from 'src/app/open-api';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';
import { SquadAssembleService } from '../squad-assemble/services/squad-assemble.service';

export interface formGroupGrid {
  title: string;
  cols?: string;
  formCols?: string;
  questions: QuestionBase<string | Date | number>[];
}

export interface lodgingPerDay{
  accomodationType: AccommodationType;   
  participant: ParticipantType;
  lodgersNumber: number;
  unitsNumber: number;
  comments: string;
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
<<<<<<< HEAD

  filledNightsArray1: {
    nightsCount: any[];
    lodgingPerDay: lodgingPerDay[]
  }[] = [];
=======
   
>>>>>>> 06f2f9aa110d0062e688974f94ebd8d70e8399f5

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
      this.setfilledNightsArray1(check,form.value);
      console.log('filledNightsArray1 is: ',this.filledNightsArray1);
      //this.filledNightsArray[check].optionsArr.push(form.value);
      this.addSleepingNightDirty = true;
      this.addSleepingNight = false;
      return;
    }
    if (this.indexToPatch > -1) {
      this.filledNightsArray[this.indexToPatch] = form.value;
    } else {
      this.setfilledNightsArray(form.value);
      //this.filledNightsArray.push(form.value);
      console.log('filledNightsArray1 is: ',this.filledNightsArray1);
    }
     this.squadAssembleService.savefilledNightsArray(this.filledNightsArray1);
     console.log('filledNightsArray is: ',this.squadAssembleService.filledNightsArray);
    this.indexToPatch = -1;
    this.addSleepingNightDirty = true;
    this.addSleepingNight = false;
  }

  deleteFilledNight(index: number) {
    //this.filledNightsArray.splice(index, 1);
    this.filledNightsArray1.splice(index, 1);
  }
  deleteFilledNightOption(indexOfOption: number, index: number) {
    //this.filledNightsArray[index].optionsArr.splice(indexOfOption, 1);
    this.filledNightsArray1[index].lodgingPerDay.splice(indexOfOption, 1);
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
    if (this.filledNightsArray1.length >= 1) {
      this.filledNightsArray1.map((item, i) => {
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
  //added by itiel
  setfilledNightsArray(form: any){
    //  let obj :{
    //   nightsCount: any[],
    //   lodgingPerDay: lodgingPerDay[]
    //  }
     let nightsCount=[];
     let lodgingPerDay1=[];
     //obj.nightsCount=form.controls['nightsCount'].value;   
     nightsCount=form.nightsCount;   
     let lodgingPerDayArray=[];
     let lodgingPerDay={} as lodgingPerDay;
     lodgingPerDay.accomodationType= form.accomodationType
     lodgingPerDay.participant= form.participant;
     lodgingPerDay.lodgersNumber= form.lodgersNumber;
     lodgingPerDay.comments= form.comments;
     lodgingPerDay.unitsNumber= form.unitsNumber;
     lodgingPerDayArray.push(lodgingPerDay);
     lodgingPerDay1= lodgingPerDayArray;
     let obj={
      nightsCount: nightsCount,
      lodgingPerDay: lodgingPerDay1
     }
     this.filledNightsArray1.push(obj);

  }

  setfilledNightsArray1(check,form: any){
    //let lodgingPerDayArray: lodgingPerDay[]=[];
    let lodgingPerDay={} as lodgingPerDay;
    lodgingPerDay.accomodationType= form.accomodationType
    lodgingPerDay.participant= form.participant;
    lodgingPerDay.lodgersNumber= form.lodgersNumber;
    lodgingPerDay.comments= form.comments;
    lodgingPerDay.unitsNumber= form.unitsNumber;
    //lodgingPerDayArray.push(lodgingPerDay);
    this.filledNightsArray1[check].lodgingPerDay.push(lodgingPerDay);
    
  }

  ngOnInit(): void { }
}
