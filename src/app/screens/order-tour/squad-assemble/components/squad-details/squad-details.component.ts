import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';
import { Observable, Subject } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadDetailsService } from './squad-details.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-squad-details',
  templateUrl: './squad-details.component.html',
  styleUrls: ['./squad-details.component.scss'],
})
export class SquadDetailsComponent implements OnInit {
  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;

  public budgetKKL: number = 18332736;
  public expend: boolean = true;

  public value$: Observable<string>;
  public questions$ = new Subject<QuestionBase<string | number | Date>[]>();
  public tablet$: Observable<boolean>;
  
  constructor(private squadAssembleService: SquadAssembleService,public tripService: TripService, private breakpoints: BreakpointService,
    private squadDetailsService: SquadDetailsService) { }

  ngOnInit(): void {
    this.tablet$ = this.breakpoints.isTablet();
    this.setSquadDetails();
  }

  setSquadDetails(){
    if(this.squadAssembleService.tripInfo.tripStart!=undefined){
      console.log('trip info is full');
      let attributeIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='attribute');
      this.squadDetailsService.questions[attributeIndex].value= this.squadAssembleService.tripInfo.attribute.id.toString();
      let activityIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='activityType');
      this.squadDetailsService.questions[activityIndex].value= this.squadAssembleService.tripInfo.activity.id.toString();
      let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='departmentId');
      this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
      let insideCenterFieldIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='insideCenterFieldId');
      this.squadDetailsService.questions[insideCenterFieldIdIndex].value= this.squadAssembleService.tripInfo.insideCenterFieldId.toString();
    }
    else{
     console.log('trip info is undefined');
    }
  }

  public onBudget() {
  }

  public listenToRadioButton(formGroup: FormGroup) {
    const radioControl = formGroup.controls['department'];
    const tripLocation = formGroup.controls['tripLocation'];
    this.value$ = radioControl.valueChanges.pipe(
      distinctUntilChanged(),
      map((value: string) => {
        value === 'domestic'
          ? tripLocation.disable({ emitEvent: false })
          : tripLocation.enable({ emitEvent: false });

        return value;
      })
    );
  }

  public logForm(form) {
    this.listenToRadioButton(form);
    this.squadAssembleService.updateFormArray(form);
  }
}
