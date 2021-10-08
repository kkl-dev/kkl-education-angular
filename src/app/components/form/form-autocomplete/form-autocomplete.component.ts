import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';
import { SquadClientService } from 'src/app/screens/order-tour/squad-assemble/components/squad-client/squad-client.service';
import { TripService } from 'src/app/services/trip.service';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { SquadDetailsService } from 'src/app/screens/order-tour/squad-assemble/components/squad-details/squad-details.service';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() public formGroup: FormGroup = null;
  @Output() deleteCustomer: EventEmitter<string> = new EventEmitter();

  public list: any[] = [];

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService,
    public tripService: TripService,
    public squadDetailsService: SquadDetailsService,
    public squadAssembleService: SquadAssembleService
  ) { }

  ngOnInit(): void {
    this.formGroup =
      this.formGroup ||
      this.formService.setFormGroup({
        questions: this.group.questions,
      });
  }
  getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;
    if (!group) {
      return null;
    }
    let name: string;
    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);
      if (childControl !== control) {
        return;
      }
      name = key;
    });
    return name;
  }

  public onAutocomplete(control: FormControl) {
    if (control.value.length > 1) {
      var name = this.getName(control)
      if (name === 'customer') {//if choose customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'client');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === 'customer');
        if (control.parent.value.clientPool !== 'kklWorker') {
          this.tripService.getCustomersByParameters(control.value, control.parent.value.clientPool, indx1, indx2)
        }
        else { this.tripService.getKKLWorkers(control.value, indx1, indx2); }
      }

      else {//if choose payer customer
        var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'payer');
        var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === "payerPoll");
        if (control.parent.value.payerName !== 'kklWorker') {
          this.tripService.getCustomersByParameters(control.value, control.parent.value.payerName, indx1, indx2)
        }
        else { this.tripService.getKKLWorkers(control.value, indx1, indx2); }
      }
    }
  }
  public onSelect(control: FormControl) {
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

  public onOptionSelected(event: MatAutocompleteSelectedEvent, question: any) {
    if (question === 'payerPoll') { this.squadAssembleService.payerCustomer = this.tripService.customers.filter(el => el.value === event.option.value)[0]; }
    if (question === 'customer') { this.squadAssembleService.Customer = this.tripService.customers.filter(el => el.value === event.option.value)[0]; }
    this.squadClientService.emitClientSelected(event.option.value);
    var customer = this.tripService.customers.filter(el => el.value === event.option.value)[0]
    this.list.push(customer);
   console.log('clientQuestions is:' ,this.squadClientService.questions)
  }
  public onDelete(item: any) {
    this.list = this.list.filter(function (el) { return el.value != item.value; });
    // if (question === 'payerPoll') {
    // var indx1 = this.squadClientService.questions.findIndex(o => o.key === 'payer');
    // var indx2 = this.squadClientService.questions[indx1].group.questions.findIndex(o => o.key === "payerPoll");
    // this.squadClientService.questions[indx1].group.questions[indx2].value = '';
    // this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options =undefined;
    // console.log(this.squadClientService.questions[indx1].group.questions[indx2])
    // }
    // if (question === 'customer') {
    // var indx3 = this.squadClientService.questions.findIndex(o => o.key === 'client');
    // var indx4 = this.squadClientService.questions[indx3].group.questions.findIndex(o => o.key === "customer");
    // this.squadClientService.questions[indx3].group.questions[indx4].value = undefined;
    // this.squadClientService.questions[indx3].group.questions[indx4].inputProps.options = [];
    // console.log(this.squadClientService.questions[indx3].group.questions[indx4])
      this.tripService.customers=[];
        this.deleteCustomer.emit('customer is deleted');
    
  }
}
