import { Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';
import { AvailableAccomodationDate, UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadClientService } from '../squad-client/squad-client.service';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-squad-schedule',
  templateUrl: './squad-schedule.component.html',
  styleUrls: ['./squad-schedule.component.scss'],
})
export class SquadScheduleComponent implements OnInit {
  @Input() public group: QuestionGroup;
  @Input() public questions: QuestionBase<string | number | Date>[];
  options!: CalendarOptions;
  AvailableDates!: AvailableAccomodationDate[];
  freeSpacesArray: FreeSpace[] = [];
  public tripId: number ;
  centerFieldId: number;
  

  public list: ListItem[] = [
    {
      label: 'מס לילות',
      value: '',
    },
    {
      label: 'מס ימים',
      value: '',
    },
  ];

  public tablet$: Observable<boolean>;

  constructor(
    private squadAssembleService: SquadAssembleService,
    private breakpoints: BreakpointService,
    private tripService:TripService,
    private userService: UserService,
    private squadClientService: SquadClientService,
    private spinner: NgxSpinnerService
  ) {   this.options = {
    firstCalendarDay: 0,
    format: 'dd/LL/yyyy',
    closeOnSelected: true,
    //  fromToDate: { from:new Date(2021, 9, 17), to:new Date(2021, 9, 22)},
    freeSpacesArray: this.tripService.freeSpacesArray,
    };}

  ngOnInit() {
    this.tablet$ = this.breakpoints.isTablet();
    this.questions = this.group.questions || [];
    this.setSchedulSquadValues();
    console.log(this.questions);
    this.setTripId();
    this.getRegionList(this.tripService.centerField.chevelCode,'chevelCode');
    this.getDatesNumber();
  }

      setTripId(){
        if (this.squadAssembleService.tripInfofromService != undefined )
         this.tripId= this.squadAssembleService.tripInfofromService.trip.id;  
     }
      getDatesNumber() {
      let  startDate =this.tripService.sleepingDates.from;
      let startDateArr = startDate.split('/');
      let startDateFormat= startDateArr[2]+','+startDateArr[1]+','+startDateArr[0];
       let endDate= this.tripService.sleepingDates.till;
       let endDateArr = endDate.split('/');
       let endDateFormat= endDateArr[2]+','+endDateArr[1]+','+endDateArr[0];
      let dateArray = new Array();
      let currentDate = new Date(startDateFormat);
      let endDate1 = new Date(endDateFormat);
      while (currentDate <= endDate1) {
        dateArray.push(new Date(currentDate));
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    
      this.list[0].value= (dateArray.length)==1?'':(dateArray.length)-1
     // this.list[1].value = (dateArray.length)-1;
      this.list[1].value =   dateArray.length;
     
    }

  
   setSchedulSquadValues(){
    let tripDescIndex= this.squadAssembleService.scheduleQuestions.findIndex(i => i.key ==='tripDescription');
    let commentIndex= this.squadAssembleService.scheduleQuestions.findIndex(i => i.key ==='commentManager');
    if(this.squadAssembleService.tripInfo?.tripStart!=undefined && !this.squadAssembleService.isRouteToNewTrip ){
      this.squadAssembleService.scheduleQuestions[tripDescIndex].value= this.squadAssembleService.tripInfo.tripDescription;
      this.squadAssembleService.scheduleQuestions[commentIndex].value= this.squadAssembleService.tripInfo.commentManager;
      if(this.squadAssembleService.tripInfo.areaTrip !=undefined){
        this.squadAssembleService.scheduleQuestions[3].value= this.squadAssembleService.tripInfo.areaTrip.id.toString();
      }
    }
    else if( this.squadAssembleService.isRouteToNewTrip){
      this.squadAssembleService.scheduleQuestions[tripDescIndex].value= undefined;
      this.squadAssembleService.scheduleQuestions[commentIndex].value= undefined;
      // if(this.squadAssembleService.tripInfo.areaTrip !=undefined){
        this.squadAssembleService.regionList=[];
        this.squadAssembleService.scheduleQuestions[3].inputProps.options=[];
        this.squadAssembleService.scheduleQuestions[3].value= undefined;
      // }

    }
   
      if (this.tripService.centerField.id != 0) {
        this.centerFieldId=this.tripService.centerField.id
        this.squadAssembleService.scheduleQuestions[1].value= this.tripService.centerField.id.toString();
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem("centerFieldId", this.tripService.centerField.id.toString());
          localStorage.setItem("centerFieldName", this.tripService.centerField.name);
        }
      }
      else { 
        this.squadAssembleService.scheduleQuestions[1].value= localStorage.getItem("centerFieldId");
        this.centerFieldId= parseInt(localStorage.getItem("centerFieldId"));
      }        
       let datesIndex= this.squadAssembleService.scheduleQuestions.findIndex(i => i.key ==='dates');
        if(!this.options.freeSpacesArray && this.centerFieldId)
         this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),this.centerFieldId);
         else
        this.squadAssembleService.scheduleQuestions[datesIndex].dateOptions= this.options;
       if (this.tripService.sleepingDates.from != '' && this.tripService.sleepingDates.till != '') {
        this.squadAssembleService.scheduleQuestions[datesIndex].value=this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till;
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem("sleepingDates", this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till);
        }
      }
      else {
        this.squadAssembleService.scheduleQuestions[datesIndex].value= localStorage.getItem("sleepingDates");
      }
     
 }


   getAvailableDates(fromDate: string, tillDate: string,centerFieldId) {
    fromDate = fromDate.substring(0, 10);
    tillDate = tillDate.substring(0, 10);
    if(!this.options.freeSpacesArray && this.centerFieldId)
     this.spinner.show();
    this.userService.getAvailableAccomodationDates(this.centerFieldId, fromDate, tillDate).subscribe(
      response => {
        this.spinner.hide();
        console.log(response)
        this.AvailableDates = response;
        this.AvailableDates.forEach(element => element.freeSpace.forEach(element => { if (element.availableBeds === undefined) { element.availableBeds = 0; } }));
        this.freeSpacesArray = this.freeSpacesArrayGenaratorFromServer(new Date(fromDate), new Date(tillDate));
        this.tripService.setFreeSpacesArray(this.freeSpacesArray);
        this.options = {
          firstCalendarDay: 0,
          format: 'dd/LL/yyyy',
          maxDate: new Date(tillDate), 
          closeOnSelected: true,
          minYear: new Date().getFullYear() - 1,
          maxYear: new Date(tillDate).getFullYear() + 1,
          freeSpacesArray: this.freeSpacesArray,
        };
        this.squadAssembleService.scheduleQuestions[2].dateOptions= this.options;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  freeSpacesArrayGenaratorFromServer(start: Date, end: Date) {
    let i = 0;
    let freeSpacesArray = [];
    start.setDate(start.getDate() - 1);

    while (start < end && i <= this.AvailableDates.length) {
      freeSpacesArray.push({
        date: start,
        freeSpace: this.AvailableDates[i].freeSpace
      });

      start = new Date(start.setDate(start.getDate() + 1));
      i++;
    }
    return freeSpacesArray;
  }

  

  //log form when valid
  
  public logForm(form) {
    
    console.log('I am form Event',form);
    // form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
     
    // });
    form.controls["centerField"].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
     form.controls["areaTrip"].patchValue('', { emitEvent: false });
     this.centerFieldId= value;
      this.getRegionList(value,'centerFieldId');
      this.getAvailableDates(new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),this.centerFieldId);
    });

    form.controls["dates"].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log('I am calendar date',value);
    });
    this.squadAssembleService.updateFormArray(form);
  }

  getRegionList(value,type){
    let chevelCode;
    if(type=='centerFieldId'){
      let centerField = this.tripService.formOptions.find(i=> i.id === parseInt(value));
       chevelCode= centerField.chevelCode;
    }
    else{
      chevelCode=value;
    }
    this.userService.getAreasByChevel(chevelCode).subscribe(res=>{
      console.log('I am res');
      this.squadAssembleService.originalRegionList=res;
      this.squadAssembleService.regionList=[];
      this.squadAssembleService.scheduleQuestions[3].inputProps.options=[];
     res.forEach(element => {
       this.squadAssembleService.regionList.push({ label: element.name, value: element.id.toString() });
       //this.regionList.push({ label: element.name, value: element.id.toString() });
     });
     this.squadAssembleService.scheduleQuestions[3].inputProps.options=this.squadAssembleService.regionList;
     //this.squadAssembleService.regionList= this.regionList;
    },(err)=>{
      console.log(err);
    })
  }
}
