import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';
import { TripService } from 'src/app/services/trip.service';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadAssembleService } from '../../services/squad-assemble.service';

@Component({
  selector: 'app-squad-schedule',
  templateUrl: './squad-schedule.component.html',
  styleUrls: ['./squad-schedule.component.scss'],
})
export class SquadScheduleComponent implements OnInit {
  @Input() public group: QuestionGroup;
  @Input() public questions: QuestionBase<string | number | Date>[];

  public tripId: number ;

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
    private tripService:TripService
  ) {}

  ngOnInit() {
    this.tablet$ = this.breakpoints.isTablet();
    this.questions = this.group.questions || [];
    console.log(this.questions);
    this.setTripId();
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
  

  //log form when valid
  
  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }
}
