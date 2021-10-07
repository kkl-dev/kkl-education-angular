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
  public editMode:boolean = false;
  public addSleepingNight: boolean = true;
  public addSleepingNightDirty: boolean = false;
  public addSleepingNightStyles = [
    { 'border-bottom': '1px solid #448ECD' },
    { 'border-bottom': '1px solid #448ECD', 'text-decoration': 'none', 'font-weight': '600' },
    { 'font-weight': '500', 'color': '#808080' }
  ]
 
  @ViewChild('filledNightsForm') filledNightsForm: FormContainerComponent;

  public indexToPatch: number = -1;
  filledNightsArray1: {
    sleepingPlace: string;
    nightsCount: string | any;
    saveFor: string;
    peopleCount: string;
    amount: string;
    comments: string;
    optionsArr: any[];
  }[] = [];
  
  filledNightsArray: {
    nightsCount: any[];
    lodgingDetailsList: lodgingPerDay[]
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
      this.setfilledNightsOptionsArray(check,form.value);
      console.log('filledNightsArray is: ',this.filledNightsArray);
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
      console.log('filledNightsArray is: ',this.filledNightsArray);
    }
    this.squadAssembleService.savefilledNightsArray(this.filledNightsArray);
     console.log('filledNightsArray is: ',this.squadAssembleService.filledNightsArray);
    this.indexToPatch = -1;
    this.addSleepingNightDirty = true;
    this.addSleepingNight = false;
    //this.createTrip();
  }

  deleteFilledNight(index: number) {
    //this.filledNightsArray.splice(index, 1);
    this.filledNightsArray.splice(index, 1);
  }
  deleteFilledNightOption(indexOfOption: number, index: number) {
    //this.filledNightsArray[index].optionsArr.splice(indexOfOption, 1);
    this.filledNightsArray[index].lodgingDetailsList.splice(indexOfOption, 1);
  }
  editFilledNight(index: number) {
    this.editFormObj = [this.filledNightsArray[index], index];
    this.addSleepingNight = true;
    this.addSleepingNightDirty = true;
    this.editMode = true;
  }
  public editFilledNightOption(optionIndex: number, index: number) {
    const item = this.filledNightsArray1[index].optionsArr[optionIndex];
    this.editFormObj = [item, index, optionIndex];
    this.addSleepingNight = true;
    this.addSleepingNightDirty = true;
    this.editMode = true;
  }
  public updateFilledNightItem(item: any[]): void {
    const index = item[1];
    const newItem = item[0].value;
    const arr = [... this.filledNightsArray1]
    if (item.length === 3) {
      const optionIndex = item[2];
      arr[index].optionsArr[optionIndex] = newItem;
      this.filledNightsArray1 = arr;
    } else {
      arr[index] = newItem;
      this.filledNightsArray1 = arr;
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
  //added by itiel
  setfilledNightsArray(form: any){

     let nightsCount=[];
     let lodgingPerDay1=[];
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
      lodgingDetailsList: lodgingPerDay1
     }
     this.filledNightsArray.push(obj);

  }

  setfilledNightsOptionsArray(check,form: any){
    let lodgingPerDay={} as lodgingPerDay;
    lodgingPerDay.accomodationType= form.accomodationType
    lodgingPerDay.participant= form.participant;
    lodgingPerDay.lodgersNumber= form.lodgersNumber;
    lodgingPerDay.comments= form.comments;
    lodgingPerDay.unitsNumber= form.unitsNumber;
    this.filledNightsArray[check].lodgingDetailsList.push(lodgingPerDay);
    
  }



  ngOnInit(): void { }
}
