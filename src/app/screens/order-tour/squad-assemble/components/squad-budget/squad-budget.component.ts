import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';
import { Budget, UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadDetailsService } from '../squad-details/squad-details.service';
import { BudgetModel } from './squad-budget.model';
import { SquadBudgetService } from './squad-budget.service';

@Component({
  selector: 'app-squad-budget',
  templateUrl: './squad-budget.component.html',
  styleUrls: ['./squad-budget.component.scss']
})
export class SquadBudgetComponent implements OnInit {

  @Input() public group: QuestionGroup;
  @Input() public formGroup: FormGroup;

  budget: Budget;
  budgetExpensesAndIncome: Budget;
  budgetExpenses = [];
  budgetIncome = [];

  // public budget: BudgetModel = {
  //   type: 'מעוף',
  //   budget: 0,
  //   expense: 1520,
  //   deliver: 3204,
  //   overflow: 167520
  // }

  // public list: ListItem[] = [
  //   {
  //     key: 'type',
  //     label: 'סוג תקציב',
  //     type: 'text'
  //   },
  //   {
  //     key: 'budget',
  //     label: 'תקצוב קק"ל',
  //     type: 'number'
  //   },
  //   {
  //     key: 'expense',
  //     label: 'עלות לקוח',
  //     type: 'number'
  //   },
  //   {
  //     key: 'deliver',
  //     label: 'ביצוע',
  //     type: 'number'
  //   },
  //   {
  //     key: 'overflow',
  //     label: 'יתרה פיננסית',
  //     type: 'number'
  //   },
  // ]

  constructor(public tripService: TripService, public squadBudgetService: SquadBudgetService, public squadDetailsService:SquadDetailsService,
    public squadAssemblyService:SquadAssembleService ,private userService: UserService) { }

  ngOnInit(): void {
    this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
    this.squadDetailsService.receiveKKLBudget.subscribe(res=>{
      console.log('I receive budget from subject event:',res);
      if(res){
        this.setKKlBudget(res);
        this.onValueChange();
      }
    
    })

    this.squadDetailsService.receiveSubBudget.subscribe(res=>{
      console.log('I receive subBudget from subject event:',res);
      this.setSubBudget(res);
    })
  
  }


  resetBudgetFields(){
    this.squadBudgetService.questions[0].inputProps.options=[];
    this.squadBudgetService.questions[1].inputProps.options=[];
    this.squadBudgetService.questions[2].group.questions[0].inputProps.options=[];
  }

    setKKlBudget(res){
       if(res==null)
       return
       this.budget=res;
       this.squadDetailsService.budget=res;
       var index = this.squadBudgetService.questions.findIndex(o => o.key === 'location');
       if(this.budget.listCity !== null){
          var list = [];
          this.budget.listCity.forEach(element => {
           list.push({ label: element.name, value: element.id.toString() });
         });
           //index = this.squadBudgetService.questions.findIndex(o => o.key === 'location');
        if (list.length === 1) {
          this.squadBudgetService.questions[index].group.questions[0].value = list[0].value;
          this.squadBudgetService.questions[index].group.questions[0].label = list[0].label;
        }
         else { this.squadBudgetService.questions[index].group.questions[0].inputProps.options = list; }
      }
      else{
        this.budget.listCity=null;
        this.squadBudgetService.questions[index].group.questions[0].inputProps.options=[];
      }
         if (this.budget.type !== undefined) {
          this.squadBudgetService.budget.type = this.budget.desc;
          this.squadBudgetService.budget.budget = this.budget.kklAmount;
          this.squadBudgetService.budget.expense = this.budget.customerAmount;
          this.squadBudgetService.budget.deliver = this.budget.execution;
          this.squadBudgetService.budget.overflow = this.budget.balanceFin;
          this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
         }
         let index1 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetIncome');
         let index2 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetExpense');
         this.squadBudgetService.questions[index1].inputProps.options=[];
         this.squadBudgetService.questions[index2].inputProps.options=[];
          this.budgetIncome=[];
          this.budgetExpenses=[];
   }

     setSubBudget(res){
      if(res==null)
      return
      this.budget=res;
      this.squadDetailsService.budget=res;
      if (this.budget.type !== undefined) {
        this.squadBudgetService.budget.type = this.budget.desc;
        this.squadBudgetService.budget.budget = this.budget.kklAmount;
        this.squadBudgetService.budget.expense = this.budget.customerAmount;
        this.squadBudgetService.budget.deliver = this.budget.execution;
        this.squadBudgetService.budget.overflow = this.budget.balanceFin;
        this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
       }
        this.budgetExpensesAndIncome = res;
       
        let index1 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetIncome');
        let index2 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetExpense');
        this.squadBudgetService.questions[index1].inputProps.options=[];
        this.squadBudgetService.questions[index2].inputProps.options=[];
         this.budgetIncome=[];
         this.budgetExpenses=[];
         if(this.budget.subBudgetIncomeList?.length>0 &&  this.budget.subBudgetExpenseList?.length>0){
           res.subBudgetIncomeList.forEach(element => {
             this.budgetIncome.push({ label: element.name, value: element.id.toString() });
           });
           res.subBudgetExpenseList.forEach(element => {
             this.budgetExpenses.push({ label: element.name, value: element.id.toString() });
            });
         }
         else{
            this.budgetIncome.push({ label: res.incomeName, value: res.incomeId.toString() });
           this.budgetExpenses.push({ label: res.expensesName, value: res.expensesId.toString() });
         }
      
            this.squadBudgetService.questions[index1].inputProps.options = this.budgetIncome;            
            this.squadBudgetService.questions[index2].inputProps.options = this.budgetExpenses;
    
       console.log('length is: ',this.squadBudgetService.questions[index2].inputProps.options.length)
       this.setIncomeAndExpenseSelected(res.incomeId.toString(),res.expensesId.toString())
     
    }

     setIncomeAndExpenseSelected(incomeId,expensesId){ 
       this.formGroup.controls['budgetIncome'].patchValue(incomeId);
       this.formGroup.controls['budgetExpense'].patchValue(expensesId);
       
     }
      onValueChange(){
        this.formGroup.controls["location"].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
           console.log('I am location event!',value.location);
           if(!value.location)
           return;
           this.getBudgetExpensesAndIncome(value.location)
       });
     }

     getBudgetExpensesAndIncome(location) {
       let budgetByParam= this.squadDetailsService.budgetByParam;
       budgetByParam.budget.cityId= parseInt(location);
      this.userService.getBadgetExpensesAndIncome(budgetByParam).subscribe(res=>{
         console.log('I am budget obj with income and expense',res);
         this.setSubBudget(res);
         //this.squadDetailsService.receiveSubBudget.next(res);
      })
     }

   

  // private setList(list: ListItem[]): ListItem[] {
  //   return list.map((item: ListItem) => {
  //     const listItem = { ...item };
  //     listItem.value = this.budget[item.key];
  //     return listItem;
  //   });
  // }


  public onClick() {

  }
}
