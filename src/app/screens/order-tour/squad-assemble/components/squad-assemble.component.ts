import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { TripService } from 'src/app/services/trip.service';
import { Observable } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadAssembleService } from '../services/squad-assemble.service';
import { SquadGroupComponent } from './squad-group/squad-group.component';
import { SquadClientService } from './squad-client/squad-client.service';

import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { TripInfo, TripModel, UserService } from 'src/app/open-api';
import { ActivatedRoute, Router } from '@angular/router';


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
  public md$: Observable<boolean>
  constructor(private squadAssembleService: SquadAssembleService, private tripService: TripService, private breakpointService: BreakpointService,
    private squadClientService: SquadClientService, private userService: UserService, private _route: Router, private _activeRoute: ActivatedRoute) {
    this.options = {
      firstCalendarDay: 0,
      format: 'dd/LL/yyyy',
      closeOnSelected: true,
      //  fromToDate: { from:new Date(2021, 9, 17), to:new Date(2021, 9, 22)},
      freeSpacesArray: this.tripService.freeSpacesArray,
    };
  }

  ngOnInit(): void {
    let param = this._activeRoute.snapshot.params["id"];
    if (param) {
      console.log('I am route to new trip');
      this.squadAssembleService.isRouteToNewTrip = true;
      this.resetTripInfoObj()
    }
    else
      console.log('I am regular  route ')
    this.tripService.getLookUp();

    this.subscribeToNewClient();
    this.md$ = this.breakpointService.isTablet()
    this.setClientSquadValues();
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


  //   setClientSquadValues(){
  //     if(this.squadAssembleService.tripInfo.tripStart!=undefined){
  //       console.log('trip info is full');
  //       let custObj={
  //         label: this.squadAssembleService.tripInfo.customer.name,
  //         value : this.squadAssembleService.tripInfo.customer.id.toString()
  //       }
  //       let payerCust={label:'',value:''}
  //       if(this.squadAssembleService.tripInfo.customerPay?.id){
  //         payerCust.value= this.squadAssembleService.tripInfo.customerPay.id.toString()
  //         payerCust.label = this.squadAssembleService.tripInfo.customerPay.name
  //       }
  //       let custArr= [];
  //       custArr.push(custObj);
  //       let payerCustArr=[];

  //       this.squadClientService.questions[0].group.questions[0].inputProps.options=custArr;     
  //       this.squadClientService.questions[0].group.questions[0].value=custObj.value;
  //       //this.squadClientService.questions[0].group.questions[0].value= `${custObj.value} - ${custObj.label}`;
  //       if(this.squadAssembleService.tripInfo.customerPay?.id){
  //         payerCustArr.push(payerCust);
  //         this.squadClientService.questions[2].group.questions[0].inputProps.options=payerCustArr;
  //         this.squadClientService.questions[2].group.questions[0].value=payerCust.value;
  //       }
  //       let contactGroupIndex=  this.squadClientService.questions.findIndex(i => i.key=='contact');
  //       let contactGroup = this.squadClientService.questions.find(i => i.key=='contact');
  //       let contactNameIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactName');
  //       this.squadClientService.questions[contactGroupIndex].group.questions[contactNameIndex].value= this.squadAssembleService.tripInfo.contactName;
  //       let contactPhoneIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactPhone');
  //       this.squadClientService.questions[contactGroupIndex].group.questions[contactPhoneIndex].value= this.squadAssembleService.tripInfo.contactPhone;
  //       let contactImailIndex= contactGroup.group.questions.findIndex(i=> i.key== 'contactEmail');
  //       this.squadClientService.questions[contactGroupIndex].group.questions[contactImailIndex].value= this.squadAssembleService.tripInfo.contactEmail;
  //     }

  //  }

  setClientSquadValues() {
    let contactGroupIndex = this.squadClientService.questions.findIndex(i => i.key == 'contact');
    let contactGroup = this.squadClientService.questions.find(i => i.key == 'contact');
    let contactNameIndex = contactGroup.group.questions.findIndex(i => i.key == 'contactName');
    let contactPhoneIndex = contactGroup.group.questions.findIndex(i => i.key == 'contactPhone');
    let contactImailIndex = contactGroup.group.questions.findIndex(i => i.key == 'contactEmail');
    if (this.squadAssembleService.tripInfo?.tripStart != undefined && !this.squadAssembleService.isRouteToNewTrip) {
      console.log('trip info is full');
      // let custObj={
      //   label: this.squadAssembleService.tripInfo.customer.name,
      //   value : this.squadAssembleService.tripInfo.customer.id.toString()
      // }
      // let custArr= [];
      // custArr.push(custObj);
      // this.squadClientService.questions[0].group.questions[0].inputProps.options=custArr;
      // this.squadClientService.questions[0].group.questions[0].value=custObj.value;
      let custObj = {
        label: this.squadAssembleService.tripInfo.customer.name,
        value: this.squadAssembleService.tripInfo.customer.id.toString()
      }
      let payerCust = { label: '', value: '' }
      if (this.squadAssembleService.tripInfo.customerPay?.id) {
        payerCust.value = this.squadAssembleService.tripInfo.customerPay.id.toString()
        payerCust.label = this.squadAssembleService.tripInfo.customerPay.name
      }
      let custArr = [];
      custArr.push(custObj);
      let payerCustArr = [];

      this.squadClientService.questions[0].group.questions[0].inputProps.options = custArr;
      this.squadClientService.questions[0].group.questions[0].value = custObj.value;
      //this.squadClientService.questions[0].group.questions[0].value= `${custObj.value} - ${custObj.label}`;
      if (this.squadAssembleService.tripInfo.customerPay?.id) {
        payerCustArr.push(payerCust);
        this.squadClientService.questions[2].group.questions[0].inputProps.options = payerCustArr;
        this.squadClientService.questions[2].group.questions[0].value = payerCust.value;
      }
      this.squadClientService.questions[contactGroupIndex].group.questions[contactNameIndex].value = this.squadAssembleService.tripInfo.contactName;
      this.squadClientService.questions[contactGroupIndex].group.questions[contactPhoneIndex].value = this.squadAssembleService.tripInfo.contactPhone;
      this.squadClientService.questions[contactGroupIndex].group.questions[contactImailIndex].value = this.squadAssembleService.tripInfo.contactEmail;
    }
    else if (this.squadAssembleService.isRouteToNewTrip) {
      this.squadClientService.questions[0].group.questions[0].inputProps.options = [];
      this.squadClientService.questions[0].group.questions[0].value = undefined;
      this.squadClientService.questions[2].group.questions[0].inputProps.options = [];
      this.squadClientService.questions[2].group.questions[0].value = undefined;
      this.squadClientService.questions[contactGroupIndex].group.questions[contactNameIndex].value = undefined;
      this.squadClientService.questions[contactGroupIndex].group.questions[contactPhoneIndex].value = undefined;
      this.squadClientService.questions[contactGroupIndex].group.questions[contactImailIndex].value = undefined;
    }

  }
  resetTripInfoObj() {
    this.squadAssembleService.formsArray = [];
    this.squadAssembleService.tripInfo = {} as TripInfo;
    this.squadAssembleService.tripInfofromService = undefined;
    this.squadAssembleService.filledNightsArray = [];
    this.tripService.centerField = { id: 0, name: '' };
    this.tripService.sleepingDates = { from: '', till: '' };
    localStorage.clear();
  }
  private subscribeToNewClient() {
    this.squadAssembleService.getNewClientObs().subscribe((value: boolean) => {
      this.newClientMode = value;
      this.setSquads();
    });
  }



}
