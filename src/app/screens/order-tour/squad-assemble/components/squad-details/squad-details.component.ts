import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadDetailsService } from './squad-details.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { BudgetByParams, UserService } from 'src/app/open-api';

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
  attributeObjSelected;
  budgetByParam = {} as BudgetByParams;
 indexChange: number=0;
  
  constructor(private squadAssembleService: SquadAssembleService,public tripService: TripService, private breakpoints: BreakpointService,
    public squadDetailsService: SquadDetailsService,private userService: UserService) { }

  ngOnInit(): void {
    this.tablet$ = this.breakpoints.isTablet();
    // if(this.squadDetailsService.attributes.length>0)
    this.setSquadDetails();
   
  }
  // getAttributes(){
  //   this.userService.getAttributes().subscribe(
  //     response => {
  //       this.squadDetailsService.attributesOriginal = response;
  //       this.squadDetailsService.attributes=[];
  //       response.forEach(element => {
  //         this.squadDetailsService.attributes.push({ label: element.name, value: element.id.toString() });
  //       });
  //       this.setSquadDetails();
  //     },
  //     error => console.log(error),       // error
  //     () => console.log('completed')     // complete
  //   )
  // }
  // setSquadDetails(){
  //   if(this.squadAssembleService.tripInfo.tripStart!=undefined){
  //     console.log('trip info is full');
  //     let attributeIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='attribute');
  //     this.squadDetailsService.questions[attributeIndex].value= this.squadAssembleService.tripInfo.attribute.id.toString();
  //     let activityIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='activityType');
  //     this.squadDetailsService.questions[activityIndex].value= this.squadAssembleService.tripInfo.activity.id.toString();
  //     // let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='departmentId');
  //     // this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
  //     let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='department');
  //     this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
  //     let tripLocationIndex = this.squadDetailsService.questions.findIndex(i => i.key ==='tripLocation');
  //     if(this.squadAssembleService.tripInfo.departmentId.toString() =='8')
  //     this.squadDetailsService.questions[tripLocationIndex].value ='8';
  //     else if(this.squadAssembleService.tripInfo.departmentId.toString() =='1'){
  //       this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
  //       this.countriesList = this.setCountryList(this.tripService.countries)
  //       this.squadDetailsService.questions[tripLocationIndex].inputProps.options = this.countriesList;
  //       this.squadDetailsService.questions[tripLocationIndex].value= this.squadAssembleService.tripInfo.country.id.toString();
  //     }
  //     let insideCenterFieldIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='insideCenterFieldId');
  //     this.squadDetailsService.questions[insideCenterFieldIdIndex].value= this.squadAssembleService.tripInfo.insideCenterFieldId.toString();
      
  //   }
  //   else{
  //    console.log('trip info is undefined');
  //   }
  // }

  setSquadDetails(){
    let attributeIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='attribute');
    let activityIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='activityType');
    let departmentIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='department');
    let tripLocationIndex = this.squadDetailsService.questions.findIndex(i => i.key ==='tripLocation');
    let insideCenterFieldIdIndex= this.squadDetailsService.questions.findIndex(i => i.key ==='insideCenterFieldId');
    if(this.squadAssembleService.tripInfo?.tripStart!=undefined && !this.squadAssembleService.isRouteToNewTrip ){
      this.squadDetailsService.questions[attributeIndex].value= this.squadAssembleService.tripInfo.attribute.id.toString();  
      this.squadDetailsService.questions[activityIndex].value= this.squadAssembleService.tripInfo.activity.id.toString();
      this.squadDetailsService.questions[departmentIdIndex].value= this.squadAssembleService.tripInfo.departmentId.toString();
      if(this.squadAssembleService.tripInfo.departmentId.toString() =='8')
      this.squadDetailsService.questions[tripLocationIndex].value ='8';
      else if(this.squadAssembleService.tripInfo.departmentId.toString() =='1'){
        this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
        this.countriesList = this.setCountryList(this.tripService.countries)
        this.squadDetailsService.questions[tripLocationIndex].inputProps.options = this.countriesList;
        this.squadDetailsService.questions[tripLocationIndex].value= this.squadAssembleService.tripInfo.country.id.toString();
      }
      this.squadDetailsService.questions[insideCenterFieldIdIndex].value= this.squadAssembleService.tripInfo.insideCenterFieldId.toString();
    }
    else if( this.squadAssembleService.isRouteToNewTrip){
      this.squadDetailsService.questions[attributeIndex].value= undefined; 
      this.squadDetailsService.questions[1].inputProps.options=[];
      this.squadDetailsService.questions[activityIndex].value= undefined; 
      this.squadDetailsService.questions[departmentIdIndex].value= '8'; 
      this.squadDetailsService.questions[insideCenterFieldIdIndex].value= undefined;
      this.squadDetailsService.budgetByParam = undefined;
      this.squadDetailsService.budget= undefined;
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
      { label: 'ישראל', value: '900' },
      { label: 'חו"ל', value: '' },
    ];
    this.squadDetailsService.questions[tripLocationIndex].inputProps.options=[];
    this.squadDetailsService.questions[tripLocationIndex].inputProps.options= options;
    this.form.controls['tripLocation'].patchValue('900');
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
    // this.form=form;
    // if(form.controls['department'].value =='8'){
    //   this.form.controls['tripLocation'].patchValue('900', { emitEvent: false });
    //   this.form.controls['tripLocation'].disable({ emitEvent: false }); 
    // }
  
    // this.listenToRadioButton(form);
    // console.log('I am form details: ', form);
    // this.squadAssembleService.updateFormArray(form);

    console.log('I am form details event', form);
    this.form=form;
    this.squadAssembleService.updateFormArray(form);
    if (this.form.controls.attribute){
      if(form.controls['department'].value =='8'){
        this.form.controls['tripLocation'].patchValue('900', { emitEvent: false });
        this.form.controls['tripLocation'].disable({ emitEvent: false }); 
      }
      this.listenToRadioButton(form);
      this.form.controls["attribute"].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.form.controls["activityType"].patchValue('', { emitEvent: false });
        this.indexChange++;
        if(this.indexChange>1){
         this.indexChange=0;
         return;
        }
          this.userService.getActivityByAttribute(value).subscribe(res=>{ 
            this.squadDetailsService.activityByAttributeOriginal = res;
            this.squadDetailsService.activityByAttribute = [];
            res.forEach(element => {
              this.squadDetailsService.activityByAttribute.push({ label: element.name, value: element.id.toString() });
            });
            this.squadDetailsService.questions[1].inputProps.options=this.squadDetailsService.activityByAttribute;
            console.log('activityByAttribute is :', this.squadDetailsService.activityByAttribute);
  
          })
          if (value === '12')
          this.resetAgeGroupField();
          this.setAutoCustomer(value)
      });
        this.form.controls["activityType"].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
             this.indexChange++;
             if(this.indexChange>1){
              this.indexChange=0;
              return;
             }
            console.log('I am activityType changed event');
            let act = this.squadDetailsService.activityByAttributeOriginal.filter(el => el.id === parseInt(value))[0];
             this.budgetByParam.activity = act;
             this.budgetByParam.budget = this.squadDetailsService.budget;
             if(this.budgetByParam.budget.isByCity !=1)
             this.getBudgetExpensesAndIncome();
         });    
    }
   
  }

  public logBudgetForm(form){
    console.log('I am budget form  event', form);
  }

  setAutoCustomer(value){
    var attr = this.tripService.attributesOriginal.filter(el => el.id === parseInt(value))[0];
     this.attributeObjSelected= attr;
     this.setBudgetParameters();
  //    if (attr.autoCustomerId !== null) {// שליפת לקוח והצבתו בלקוח רצוי 
  //     this.tripService.getCustomer(attr.autoCustomerId);
  //  }
 }
 setBudgetParameters(){
     this.budgetByParam.attribute= this.attributeObjSelected;
      //find index 'dates'
     var index;
     for (var i in this.squadAssembleService.formsArray) {
        Object.keys(this.squadAssembleService.formsArray[i].controls).forEach(key => {
             if (key === 'dates') { index = i; }
        });
     }
        let tripDatesArr = this.squadAssembleService.formsArray[index].controls['dates'].value.split("-");
       let tripStart = tripDatesArr[0];
       let tripStartArr = tripStart.split("/");
       tripStart = tripStartArr[2] + '-' + tripStartArr[1] + '-' + tripStartArr[0];
       this.budgetByParam.tripStart = tripStart;
       this.getBudgetByKKL();
    }
         resetAgeGroupField(){
         var index;
         for (var i in this.squadAssembleService.formsArray) {
           Object.keys(this.squadAssembleService.formsArray[i].controls).forEach(key => {
             if (key === 'ageGroup') { index = i; }
           });
         }
         this.squadAssembleService.formsArray[index].controls['ageGroup'].setValue(undefined)
     }

     getBudgetByKKL(){
       this.squadDetailsService.budgetByParam=this.budgetByParam;
       this.userService.getBadgetKKl(this.budgetByParam).subscribe(res=>{
         this.squadDetailsService.budget = res;
         console.log(res);
         this.squadDetailsService.receiveKKLBudget.next(res);
      })

    }

    getBudgetExpensesAndIncome() {
     this.squadDetailsService.budgetByParam=this.budgetByParam;
     this.userService.getBadgetExpensesAndIncome(this.budgetByParam).subscribe(res=>{
        console.log('I am budget obj with income and expense',res);
        this.squadDetailsService.budget=res;
        this.squadDetailsService.receiveSubBudget.next(res);
     })
    }

}
