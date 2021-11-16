import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadDetailsService } from './squad-details.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { UserService } from 'src/app/open-api';

@Component({
  selector: 'app-squad-details',
  templateUrl: './squad-details.component.html',
  styleUrls: ['./squad-details.component.scss'],
})
export class SquadDetailsComponent implements OnInit {
  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;
  public form: FormGroup;
   countriesSub: Subscription;
   countriesList=[];
  //public budgetKKL: number = 18332736;
  public budgetKKL: number ;
  public expend: boolean = true;

  public value$: Observable<string>;
  public questions$ = new Subject<QuestionBase<string | number | Date>[]>();
  public tablet$: Observable<boolean>;
  
  constructor(private squadAssembleService: SquadAssembleService,public tripService: TripService, private breakpoints: BreakpointService,
    private squadDetailsService: SquadDetailsService,private userService: UserService) { }

  ngOnInit(): void {
    this.tablet$ = this.breakpoints.isTablet();
    this.setSquadDetails();
    this.tripService.activityByAttr.subscribe(res=>{
       console.log(res); 
       this.squadDetailsService.questions[1].inputProps.options=res;
    })
    // this.tripService.activityByAttr.subscribe(res=>{
    //   console.log('I am activities from tripService', res);
    // })
  }

  setSquadDetails(){
    if(this.squadAssembleService.tripInfo.tripStart!=undefined){
      console.log('trip info is full');
      let attributeIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='attribute');
      this.squadDetailsService.questions[attributeIndex].value= this.squadAssembleService.tripInfo.attribute.id.toString();
      let activityIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='activityType');
      this.squadDetailsService.questions[activityIndex].value= this.squadAssembleService.tripInfo.activity.id.toString();
      // let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='departmentId');
      // this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
      let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='department');
      this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
      let tripLocationIndex = this.squadDetailsService.questions.findIndex(i => i.key ==='tripLocation');
      if(this.squadAssembleService.tripInfo.departmentId.toString() =='8')
      this.squadDetailsService.questions[tripLocationIndex].value ='8';
      else if(this.squadAssembleService.tripInfo.departmentId.toString() =='1'){
        this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
        this.countriesList = this.setCountryList(this.tripService.countries)
        this.squadDetailsService.questions[tripLocationIndex].inputProps.options = this.countriesList;
        this.squadDetailsService.questions[tripLocationIndex].value= this.squadAssembleService.tripInfo.country.id.toString();
      }
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
    //const departmentId = formGroup.controls['departmentId'];
    
    this.value$ = radioControl.valueChanges.pipe(
      distinctUntilChanged(),
      // map((value: string) => {
      //   value === 'domestic'
      //     ? departmentId.disable({ emitEvent: false })
      //     : departmentId.enable({ emitEvent: false });

      //   return value;
      // })
      map((value: string) => {
        value === '8'
          ? this.setVal()
          : this.setCountries();

        return value;
      })
    );
  }
 
   setVal(){
    let tripLocationIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='tripLocation');
    //this.squadDetailsService.questions[departmentIdIndex].value= '1';
    let options =   [
      { label: 'ישראל', value: '8' },
      { label: 'חו"ל', value: '1' },
    ];
    this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
    this.squadDetailsService.questions[tripLocationIndex].inputProps.options= options;
    this.form.controls['tripLocation'].patchValue('8');
     this.form.controls['tripLocation'].disable({ emitEvent: false });   
   }
   setCountries(){
     this.form.controls['tripLocation'].enable({ emitEvent: false }); 
     let tripLocationIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='tripLocation');
     this.countriesSub= this.userService.getCountries().subscribe(res=>{
       console.log('countries is: ',res);
       this.tripService.countries=res;
       this.setCountryList(res);
      // res.forEach(element=>{
      //   this.countriesList.push({ label: element.name, value: element.id })
      // })
      this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
      this.squadDetailsService.questions[tripLocationIndex].inputProps.options = this.countriesList;
     })     
   }
    setCountryList(res){
      res.forEach(element=>{
        this.countriesList.push({ label: element.name, value: element.id })
      })
      return this.countriesList;
   }
  public logForm(form) {
    this.form=form;
    this.listenToRadioButton(form);
    console.log('I am form details: ', form);
   
    this.squadAssembleService.updateFormArray(form);
  }
}
