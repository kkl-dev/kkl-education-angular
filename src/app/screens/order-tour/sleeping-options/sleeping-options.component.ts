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
  @ViewChild('filledNightsForm') filledNightsForm: FormContainerComponent;

  // accomodationTypeId: new FormControl(null, [Validators.required]),
  // date: new FormControl(null, [Validators.required]),
  // participantId: new FormControl(null, [Validators.required]),
  // lodgersNumber: new FormControl(null, [Validators.required]),
  // amount: new FormControl(null, [Validators.required]),
  // unitsNumber: new FormControl(null, [Validators.required]),
  //  comments: new FormControl(null, [Validators.required]),
  public indexToPatch: number = -1;
  tripInfo: TripInfo;
  filledNightsArray1 :LodgingReservation[]=[];
  filledNightsArray: {
    accomodationTypeId: number,
    accomodationTypeName: string,
    date: string,
    participantId: number,
    participantName: string,
    lodgersNumber: number,
    unitsNumber: number,
    comments: string,
  }[] = [
    {
      unitsNumber: 3,
      comments: 'הערה חדשה',
      date: 'לילה 1',
      lodgersNumber: 3,
      participantId: 4,
      accomodationTypeId: 1,
      accomodationTypeName: 'בקתה',
      participantName: 'מבוגרים'
    },
  ];

  formCols: number = 12;
  questions: QuestionBase<string | number>[] = [];

  constructor(
    private checkAvailabilityService: CheckAvailabilityService, private sleepingService: SleepingServiceService, private squadAssembleService:SquadAssembleService ,private userService:UserService ) {
    //this.questions = this.sleepingService.questions;
    //this.changeDatesHandler(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
  }

  addFilledNight(form) {
    if (this.indexToPatch > -1) {
      this.filledNightsArray[this.indexToPatch] = form.value;
    } else {
      this.filledNightsArray.push(form.value);
      this.filledNightsArray1.push(form.value);
      //console.log(this.filledNightsArray);
    }
     this.squadAssembleService.savefilledNightsArray(this.filledNightsArray1);
     console.log('filledNightsArray is: ',this.squadAssembleService.filledNightsArray);
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


   createTrip(){
    this.tripInfo= this.squadAssembleService.tripInfo;
    this.tripInfo.lodgingReservation= this.filledNightsArray;
    
    this.userService.createTrip(this.tripInfo).subscribe(res=>{
      console.log(res);
   },(err)=>{
     console.log(err);
   })
  }

}
