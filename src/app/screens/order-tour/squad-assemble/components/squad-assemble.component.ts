import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { TripService } from 'src/app/services/trip.service';
import { Observable } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadAssembleService } from '../services/squad-assemble.service';
import { SquadGroupComponent } from './squad-group/squad-group.component';
import { SquadClientService } from './squad-client/squad-client.service';

import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { UserService } from 'src/app/open-api';

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  public squads: QuestionGroup[];
  public budgetGroup: QuestionGroup;
  options!: CalendarOptions;
  private newClientMode: boolean;
  //regionList=[];
  public md$ : Observable<boolean>
  constructor(private squadAssembleService: SquadAssembleService,private tripService:TripService, private breakpointService : BreakpointService,
    private squadClientService: SquadClientService,private userService:UserService) {
      this.options = {
      firstCalendarDay: 0,
      format: 'dd/LL/yyyy',
      closeOnSelected: true,
      //  fromToDate: { from:new Date(2021, 9, 17), to:new Date(2021, 9, 22)},
      freeSpacesArray: this.tripService.freeSpacesArray,
      };
    }
  
  ngOnInit(): void {
    this.tripService.getLookUp();
   
    this.subscribeToNewClient();
    this.md$ = this.breakpointService.isTablet()
    this.setSchedulAndClientSquadValues();
  }

  private setSquads() {
    this.squads = [
      {
        key: 'schedule',
        header: { label: 'מועד ושם הטיול', slot: 'tourId' },
        questions: this.squadAssembleService.scheduleQuestions,
      },
      this.newClientMode
        ? this.squadAssembleService.newClient
        : {
            key: 'client',
            header: { label: 'לקוח', slot: 'client' },
            questions: this.squadAssembleService.customerFormInputs,
            cols: 3,
          },
      {
        key: 'group',
        header: { label: 'הרכב הקבוצה', slot: 'gender' },
        questions: this.squadAssembleService.groupAssembleFormMixedInputs,
        cols: 5,
      },
      {
        key: 'details',
        header: { label: 'פרטי הטיול', slot: '' },
        questions: this.squadAssembleService.tourDetailsFormInputs,
      },
    ].reverse();

    this.budgetGroup = {
      key: 'budget',
      header: { label: 'תקציב', slot: 'budget' },
      questions: this.squadAssembleService.budgetQuestions,
      cols: 1,
    };
  }

 
  setSchedulAndClientSquadValues(){
    if(this.squadAssembleService.tripInfo.tripStart!=undefined){
    // if(this.squadAssembleService.tripInfo !=undefined){
      console.log('trip info is full');
      // let tripDescIndex= this.squadAssembleService.scheduleQuestions.findIndex(i => i.key ==='tripDescription');
      // this.squadAssembleService.scheduleQuestions[tripDescIndex].value= this.squadAssembleService.tripInfo.tripDescription;
      // let commentIndex= this.squadAssembleService.scheduleQuestions.findIndex(i => i.key ==='commentManager');
      // this.squadAssembleService.scheduleQuestions[commentIndex].value= this.squadAssembleService.tripInfo.commentManager;
      // // set client and contact form values
      let custObj={
        label: this.squadAssembleService.tripInfo.customer.name,
        value : this.squadAssembleService.tripInfo.customer.id.toString()
      }
      let custArr= [];
      custArr.push(custObj);
      this.squadClientService.questions[0].group.questions[0].inputProps.options=custArr;
      this.squadClientService.questions[0].group.questions[0].value=custObj.value;
      let contactGroupIndex=  this.squadClientService.questions.findIndex(i => i.key=='contact');
      let contactGroup = this.squadClientService.questions.find(i => i.key=='contact');
      let contactNameIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactName');
      this.squadClientService.questions[contactGroupIndex].group.questions[contactNameIndex].value= this.squadAssembleService.tripInfo.contactName;
      let contactPhoneIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactPhone');
      this.squadClientService.questions[contactGroupIndex].group.questions[contactPhoneIndex].value= this.squadAssembleService.tripInfo.contactPhone;
      let contactImailIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactEmail');
      this.squadClientService.questions[contactGroupIndex].group.questions[contactImailIndex].value= this.squadAssembleService.tripInfo.contactEmail;
    }
  
 }
  private subscribeToNewClient() {
    this.squadAssembleService.getNewClientObs().subscribe((value: boolean) => {
      this.newClientMode = value;
      this.setSquads();
    });
  }


  // setDefaultValues(name: string) {
  //   switch (name) {
  //     case 'dates':
  //       if (this.tripService.sleepingDates.from != '' && this.tripService.sleepingDates.till != '') {
  //         this.control.setValue(this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till);
  //         if (typeof (Storage) !== "undefined") {
  //           localStorage.setItem("sleepingDates", this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till);
  //         }
  //       }
  //       else {
  //         this.control.setValue(localStorage.getItem("sleepingDates"));
  //       }
  //       break;

  //     case 'centerField':
  //       if (this.tripService.centerField.id != 0) {
  //         this.control.setValue(this.tripService.centerField.id.toString());
  //         if (typeof (Storage) !== "undefined") {
  //           localStorage.setItem("centerFieldId", this.tripService.centerField.id.toString());
  //           localStorage.setItem("centerFieldName", this.tripService.centerField.name);
  //         }
  //       }
  //       else {
  //         this.control.setValue(localStorage.getItem("centerFieldId"));
  //       }
  //   }
  // }
}
