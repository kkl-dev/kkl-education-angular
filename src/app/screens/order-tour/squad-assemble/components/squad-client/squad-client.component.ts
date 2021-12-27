import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBase, SelectOption } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadClientService } from './squad-client.service';
import { SquadNewClientService } from '../squad-new-client/squad-new-client.service';
import { TripService } from 'src/app/services/trip.service';
import { BaseCustomer, UserService } from 'src/app/open-api';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-squad-client',
  templateUrl: './squad-client.component.html',
  styleUrls: ['./squad-client.component.scss'],
})
export class SquadClientComponent implements OnInit, OnDestroy {
  @Input() public group: QuestionGroup;

  public clientQuestions: QuestionBase<string>;
  public contactQuestions: QuestionBase<string>;
  public payerQuestions: QuestionBase<string>;

  public $questions: Subject<QuestionBase<string | number | Date>[]>;
  public $saveMode: Observable<boolean>;

  public editMode: boolean;

  public formGroup: FormGroup;

  private subjectSchool: Subject<SelectOption>;
  public schools$: Observable<SelectOption>;

  private subjectOptions: BehaviorSubject<SelectOption[]>;
  public options$: Observable<SelectOption[]>;

  public schoolOptions$: Observable<SelectOption[]>;

  private unsubscribeToEdit: Subscription;
  private unsubscribeToClient: Subscription;

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService,
    private squadNewClientService: SquadNewClientService,
    private squadAssembleService: SquadAssembleService,
    public tripService: TripService,
    private userService: UserService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subjectSchool = new Subject<SelectOption>();
    this.schools$ = this.subjectSchool.asObservable();

    this.subjectOptions = new BehaviorSubject<SelectOption[]>([]);
    this.options$ = this.subjectOptions.asObservable();
    this.$questions = new Subject<QuestionBase<string | number | Date>[]>();
    this.setQuestions();
    this.subscribeToEditMode();
    this.subscribeToClientData();

    this.$saveMode = this.squadAssembleService.getSaveModeObs();
    this.formGroup = this.formService.setFormGroup(this.group);
    this.setSchoolOptions();
  }

  
  ngOnDestroy(): void {
    this.unsubscribeToEdit.unsubscribe();
    this.unsubscribeToClient.unsubscribe();
  }

  private findQuestions(key: string): QuestionBase<string> {
    return this.group.questions.find(
      (question: QuestionBase<string>) => question.key == key
    );
  }

  private setQuestions() {
    this.clientQuestions = this.findQuestions('client');
    this.contactQuestions = this.findQuestions('contact');
    this.payerQuestions = this.findQuestions('payer');
  }

  private subscribeToEditMode(): void {
    this.unsubscribeToEdit = this.squadClientService
      .getEditModeObs()
      .subscribe((mode: boolean) => {
        this.editMode = mode;
      });
  }

  private subscribeToClientData(): void {
    this.unsubscribeToClient = this.squadClientService
      .getClientObs()
      .subscribe((value: any) => {
        this.squadClientService.emitEditMode(true);
        // if(this.squadClientService.customerTypeSelected=='customer')
        this.updateClientForm(value);
      });
  }

  private toggleFormState(): void {
    this.editMode
      ? this.formGroup.controls.contact.enable()
      : this.formGroup.controls.contact.disable();
  }

  private updateClientForm(value?: string): void {
    var customer = this.squadClientService.customersOriginal.filter(el => el.id ===  parseInt(value))[0]
    this.formGroup.controls.contact.patchValue({
      contactName: customer.contactName || '',
      contactPhone: customer.contactMobile || '',
      contactEmail: customer.contactEmail || '',
    });
  }

  // EVENTS METHODS SECTION

  // method to add new editMode form
  public onAddClient(): void {
    this.squadNewClientService.emitNewClient(true)
  }

  public onEdit(): void {
    this.squadClientService.emitEditMode(true);
    this.squadAssembleService.emitSaveMode(true);
    this.toggleFormState();
  }

  public onClear() {
    this.squadAssembleService.emitSaveMode(false);
    this.formGroup.controls.contact.disable();
  }

  public onAutocomplete(control: FormControl) {
    console.log('I am onAutocomplete event');
    // old code
    console.log("onAutocomplete: ", control);
    if (control.value.length > 1) {
      if (control.parent.controls.hasOwnProperty('customer')) {//if choose customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'client');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === 'customer');
        if (control.parent.value.clientPool !== 'kklWorker') {
          this.getCustomersByParameters(control.value, control.parent.value.clientPool, indx1, indx2)
        }
        else { this.getKKLWorkers(control.value, indx1, indx2); }
      }

      else {//if choose payer customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'payer');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === "payerPoll");
        if (control.parent.value.payerName !== 'kklWorker') {
          this.getCustomersByParameters(control.value, control.parent.value.payerName, indx1, indx2)
        }
        else { this.getKKLWorkers(control.value, indx1, indx2); }
      }
    }
    // end old code
  }

  public onSelect(control: FormControl) {
    console.log('I am onSelect event');
    // old code
    var index;
    for (var i in this.squadAssembleService.formsArray) {
      Object.keys(this.squadAssembleService.formsArray[i].controls).forEach(key => {
        if (key === 'attribute') { index = i; }
      });
    }
    if (control.value === "kklWorker") {
      this.squadAssembleService.formsArray[index].controls['attribute'].setValue("12");
      this.squadAssembleService.formsArray[index].controls['attribute'].disable();
    }
    else { this.squadAssembleService.formsArray[index].controls['attribute'].enable(); }
    // end old code
  }

  
  // return event : {key : string, option : {label, value}}
  public onOptionSelected(event: any) {
    console.log('I am onOptionSelected event');
    //old code
    // let customerCode;
    // let field
    // if (field === 'customer') {
    //    let customer = this.squadClientService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0];
    //    customerCode= customer.id;
    // }
    //  else  if (field === 'payerPoll'){
    //     let customer= this.squadClientService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0]; 
    //     customerCode= customer.id;
    //  }
    
    // this.userService.checkIfCustomerHasDebt(customerCode).subscribe(res=>{
    //     let stringTrue: string = res.toString();  
    //      if (stringTrue == 'true'){    
    //        //this.flag =true;  
    //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //         width: '500px',
    //         data: { message: 'לא ניתן לבחור לקוח זה בשל יתרת חוב', content: '', rightButton: 'ביטול', leftButton: 'אישור' }
    //       })
    //       if (field === 'customer'){
           
    //           //this.onDelete(undefined);
    //         }   
    //         else if (field === 'payerPoll'){
    //           //this.onDelete(undefined);
    //           //this.squadAssembleService.payerCustomer={} as BaseCustomer;
    //         }
           
    //      }
    //      else{
    //       if (field === 'payerPoll') { this.squadAssembleService.payerCustomer = this.tripService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0]; }
    //       if (field === 'customer') { this.squadAssembleService.Customer = this.tripService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0]; }
    //       this.squadClientService.emitClientSelected(event.option.value);
    //       //var customer = this.tripService.customers.filter(el => el.value === event.option.value)[0]
    //       //this.list.push(customer);
    //       console.log('clientQuestions is:' ,this.squadClientService.questions)
    //      }
    // },(err)=>{
    //   console.log(err);
    // })
    // in comment for test
    // if (question === 'payerPoll') { this.squadAssembleService.payerCustomer = this.tripService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0]; }
    // if (question === 'customer') { this.squadAssembleService.Customer = this.tripService.customersOriginal.filter(el => el.id === parseInt(event.option.value))[0]; }
    // this.squadClientService.emitClientSelected(event.option.value,question);
    // var customer = this.tripService.customers.filter(el => el.value === event.option.value)[0]
    // this.list.push(customer);
    // console.log('clientQuestions is:' ,this.squadClientService.questions)
    // end comment for test


    //end old code
    const { option, key } = event;
    const client = `${option.value} - ${option.label}`;
    //this.formGroup.controls.client['controls'][key].patchValue(client);
    //test
    if(key=='customer')
    this.formGroup.controls.client['controls'][key].patchValue(client);
    else if (key=='payerPoll')
    this.formGroup.controls.payer['controls'][key].patchValue(client);
    //end test
    this.squadClientService.emitClientSelected(client);
    console.log('I am before next');
    this.subjectSchool.next(option);

      // TODO - SERVER SIDE
  }

  public onDelete(option: SelectOption) {
    console.log(option);
    //this.formGroup.controls.client['controls']['customer'].patchValue(undefined);
  }


  private setSchoolOptions() {
    this.schoolOptions$ = this.options$.pipe(
      switchMap((options: SelectOption[]) => {
        return this.schools$.pipe(
          map((option: SelectOption) => {
            console.log('I am option: ', option);
            options.push(option);
            return options;
          })
        );
      })
    );
  }

  

  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }

  // internal functions
  getCustomersByParameters(customer, clientPool, indx1, indx2) {
    //this.flag =false;
    this.userService.getCustomersByParameters(customer, clientPool).subscribe(
      response => {
        console.log('response', response)
        this.squadClientService.customersOriginal = response;
        this.squadClientService.customers = [];
        response.forEach(element => {
          this.squadClientService.customers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.squadClientService.customers;
        // if (this.flag ==true ){
        //   this.onDelete(undefined);
        // }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  
  getKKLWorkers(customer, indx1, indx2) {
    this.userService.getKKLWorkers(customer).subscribe(
      response => {
        console.log('response', response)
        this.squadClientService.customersOriginal = response;
        this.squadClientService.customers = [];
        response.forEach(element => {
          this.squadClientService.customers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.squadClientService.customers;
        // if (this.flag ==true ){
        //   this.onDelete(undefined);
        // }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  onDelete1(event){
    console.log('I am delete event', event);
    this.squadAssembleService.Customer={} as BaseCustomer;
     let index1 = this.squadClientService.questions.findIndex(o => o.key === 'client');
     let index2 = this.squadClientService.questions[index1].group.questions.findIndex(o => o.key === 'customer');
    this.squadClientService.questions[index1].group.questions[index2].inputProps.options=[];
    this.formGroup.controls.contact.patchValue({
      contactName:  '',
      contactPhone:  '',
      contactEmail:  '',
    });
  }

    onDeletePayer(event){
      this.squadClientService.questions[2].group.questions[0].inputProps.options=[];
      this.squadAssembleService.payerCustomer={} as BaseCustomer;
  }
}
