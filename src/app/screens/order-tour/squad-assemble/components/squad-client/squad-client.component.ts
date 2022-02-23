import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBase, SelectOption } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import {
  Subject,
  Observable,
  Subscription,
  BehaviorSubject,
  iif,
  of,
  merge,
} from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadClientService } from './squad-client.service';
import { SquadNewClientService } from '../squad-new-client/squad-new-client.service';
import { TripService } from 'src/app/services/trip.service';
import { BaseCustomer, KKLWorker, UserService } from 'src/app/open-api';
import { map, startWith, switchMap } from 'rxjs/operators';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
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
  private subjectPayer: Subject<SelectOption>;

  private removeSchool: Subject<string>;
  private removePayer: Subject<string>;

  private subjectSchoolOptions: BehaviorSubject<SelectOption[]>;
  private subjectPayerOptions: BehaviorSubject<SelectOption[]>;

  public schoolOptions$: Observable<SelectOption[]>;
  public payerOptions$: Observable<SelectOption[]>;

  private unsubscribeToEdit: Subscription;
  private unsubscribeToClient: Subscription;
  flag :boolean=false;
  isCustomerHasDept: boolean=false;
  isKKlWorkerSelected: boolean=false;

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
    
    this.removeSchool = new Subject<string>();
    this.subjectSchoolOptions = new BehaviorSubject<SelectOption[]>([]);
    

    this.subjectPayer = new Subject<SelectOption>();
    this.removePayer = new Subject<string>();
    this.subjectPayerOptions = new BehaviorSubject<SelectOption[]>([]);
   
    

    this.$questions = new Subject<QuestionBase<string | number | Date>[]>();
    this.setQuestions();
    this.subscribeToEditMode();
    this.subscribeToClientData();

    this.$saveMode = this.squadAssembleService.getSaveModeObs();
    this.formGroup = this.formService.setFormGroup(this.group);

    this.schoolOptions$ = merge(this.setSchoolOptions(), this.onDeleteSchool());
    
    this.payerOptions$ = merge(this.setPayerOptions(), this.onDeletePayer());
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
         if(this.squadClientService.customerTypeSelected=='customer')
        this.updateClientForm(value);
      });
  }

  private toggleFormState(): void {
    this.editMode
      ? this.formGroup.controls.contact.enable()
      : this.formGroup.controls.contact.disable();
  }

  private updateClientForm(value?: string): void {
    if(!this.isKKlWorkerSelected){
      var customer = this.squadClientService.customersOriginal.filter(el => el.id ===  parseInt(value))[0]
      this.formGroup.controls.contact.patchValue({
        contactName: customer.contactName || '',
        contactPhone: customer.contactMobile || '',
        contactEmail: customer.contactEmail || '',
      });
    }
    else{
      let kklWorker = this.squadClientService.kklWorkerOriginal.filter(el => el.id ===  parseInt(value))[0]
      this.formGroup.controls.contact.patchValue({
        contactName: kklWorker.name || '',
        contactPhone: kklWorker.phone || '',
        contactEmail: kklWorker.email || '',
      });
    }
  
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
    console.log("onAutocomplete: ", control);
    if (control.value.length > 1) {
      if (control.parent.controls.hasOwnProperty('customer')) {//if choose customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'client');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === 'customer');
        if (control.parent.value.clientPool !== 'kklWorker') {
          this.isKKlWorkerSelected=false;
          this.getCustomersByParameters(control.value, control.parent.value.clientPool, indx1, indx2,'customer')
        }
        else { this.getKKLWorkers(control.value, indx1, indx2,'customer'); 
              this.isKKlWorkerSelected=true;
             }
        //this.getCustomersByParameters(control.value, control.parent.value.clientPool, indx1, indx2,'customer')
      }

      else {//if choose payer customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'payer');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === "payerName");
        // if (control.parent.value.payerName !== 'kklWorker') {
        //   this.getCustomersByParameters(control.value, control.parent.value.payerPull, indx1, indx2,'payer')
        // }
        // else { this.getKKLWorkers(control.value, indx1, indx2,'payer'); }
        this.isKKlWorkerSelected=false;
        this.getCustomersByParameters(control.value, control.parent.value.payerPull, indx1, indx2,'payer')
      }
    }
    // end old code
  }

  public onSelect(control: FormControl) {
    console.log('I am onSelect event');
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
  }

  
  // return event : {key : string, option : {label, value}}
  public onOptionSelected(event: any, groupKey: string) {
    console.log('I am onOptionSelected event');
    //old code
    let customerCode;
    if (groupKey === 'client') {
       customerCode= event.option.value;
    }
     else  if (groupKey === 'payer'){
        customerCode= event.option.value;
     }
    
    this.userService.checkIfCustomerHasDebt(customerCode).subscribe(res=>{
        let stringTrue: string = res.toString();  
         if (stringTrue == 'true'){    
           this.flag =true;  
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'לא ניתן לבחור לקוח זה בשל יתרת חוב', content: '',  leftButton: 'אישור' }
          })
          if (groupKey === 'client'){   
            this.removeSchool.next(event.option.value); 
            this.clearCustomerFields();
            this.formGroup.get('client')['controls'].customer.patchValue(undefined, { emitEvent: false });
            }   
            else if (groupKey === 'payer'){
              this.removePayer.next(event.option.value);
              this.clearPayerFields();
              this.formGroup.get('payer')['controls'].payerName.patchValue(undefined, { emitEvent: false });
            }  
            return;     
         }
     
    },(err)=>{
      console.log(err);
    })
 
    const { option, key } = event;
    const label = `${option.value} - ${option.label}`;
    this.formGroup.controls[groupKey]['controls'][key].patchValue(label);
    this.squadClientService.emitClientSelected(label,key);

    if (groupKey === 'client') {
      this.subjectSchool.next(option);
      if(!this.isKKlWorkerSelected){
        this.squadAssembleService.kklWorker=undefined;
        this.squadAssembleService.Customer.id=option.value;
        this.squadAssembleService.Customer.name= option.label;
      }
      else{
        this.squadAssembleService.Customer.id=125000573;
        this.squadAssembleService.Customer.name= 'עובד קק"ל';
        this.squadAssembleService.kklWorker={} as KKLWorker;
        this.squadAssembleService.kklWorker.id=option.value;
        this.squadAssembleService.kklWorker.name= option.label;
      }
      
    }
    if (groupKey === 'payer') {
      this.subjectPayer.next(option);
      this.squadAssembleService.payerCustomer.id=option.value;
      this.squadAssembleService.payerCustomer.name= option.label;
    }

      // TODO - SERVER SIDE
  }

 
  public onDelete(option: {
    optionToDelete: SelectOption;
    question: QuestionAutocomplete;
  }) {
    const { question, optionToDelete } = option;

    // TODO - server logic here

    const { key } = question;


    if (key === 'customer') {
      this.removeSchool.next(optionToDelete.value);
      this.clearCustomerFields();
     this.formGroup.get('client')['controls'].customer.patchValue(undefined, { emitEvent: false });
   
    }
    if (key === 'payerName') {
      this.removePayer.next(optionToDelete.value);
      this.clearPayerFields();
      this.formGroup.get('payer')['controls'].payerName.patchValue(undefined, { emitEvent: false });
    }
  }

  private onDeleteSchool(): Observable<SelectOption[]> {
    return this.removeSchool.asObservable().pipe(
      switchMap((value: string) => {
        return this.subjectSchoolOptions.asObservable().pipe(
          map((options: SelectOption[]) => {
            const index = options.findIndex((option) => option.value === value);
            options.splice(index, 1);
            return options;
          })
        );
      })
    );
  }

  private onDeletePayer(): Observable<SelectOption[]> {
    return this.removePayer.asObservable().pipe(
      switchMap((value: string) => {
        return this.subjectPayerOptions.asObservable().pipe(
          map((options: SelectOption[]) => {
            const index = options.findIndex((option) => option.value === value);
            options.splice(index, 1);
            return options;
          })
        );
      })
    );
  }

  private setSchoolOptions() {
    return this.subjectSchool.asObservable().pipe(
      switchMap((option: SelectOption) => {
        return this.subjectSchoolOptions.asObservable().pipe(
          switchMap((options: SelectOption[]) => {
            return of(this.findOption(options, option)).pipe(
              map((found: boolean) => {
                found ? options : options.push(option);
                return options;
              })
            );
          })
        );
      })
    );
  }

 

  private setPayerOptions() {
    return this.subjectPayer.asObservable().pipe(
      startWith({ value: '', label: '' }),
      switchMap((option: SelectOption) => {
        return this.subjectPayerOptions.asObservable().pipe(
          switchMap((options: SelectOption[]) => {
            return of(this.findOption(options, option)).pipe(
              map((found: boolean) => {
                found ? options : options.push(option);
                return options;
              })
            );
          })
        );
      })
    );
  }

  private findOption(options: SelectOption[], option: SelectOption): boolean {
    if (option.value) {
      return !!options.find((item) => item.value === option.value);
    } else {
      return true;
    }
  }

  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }

  // internal functions
  getCustomersByParameters(customer, clientPool, indx1, indx2,type) {
    this.flag =false;
    this.userService.getCustomersByParameters(customer, clientPool).subscribe(
      response => {
        console.log('response', response)
        this.squadClientService.customersOriginal = response;
        this.squadClientService.customers = [];
        response.forEach(element => {
          this.squadClientService.customers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.squadClientService.customers;
        if (this.flag ==true ){
          if(type=='customer')
           this.clearCustomerFields();
          else if(type=='payer')
          this.clearPayerFields();
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  
  getKKLWorkers(customer, indx1, indx2,type) {
    this.flag =false;
    this.userService.getKKLWorkers(customer).subscribe(
      response => {
        console.log('response', response)
        this.squadClientService.kklWorkerOriginal = response;
        this.squadClientService.kklWorkers = [];
        response.forEach(element => {
          this.squadClientService.kklWorkers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.squadClientService.kklWorkers;
        if (this.flag ==true ){
          if(type=='customer')
           this.clearCustomerFields();
          else if(type=='payer')
          this.clearPayerFields();
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  clearCustomerFields(){
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

   clearPayerFields(){
      let index1 = this.squadClientService.questions.findIndex(o => o.key === 'payer');
      let index2 = this.squadClientService.questions[index1].group.questions.findIndex(o => o.key === 'payerName');
      this.squadClientService.questions[index1].group.questions[index2].inputProps.options=[];
      this.squadAssembleService.payerCustomer={} as BaseCustomer;
  }
}
