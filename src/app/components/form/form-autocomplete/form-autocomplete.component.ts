import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';
import { Observable, of } from 'rxjs';
import { SelectOption } from '../logic/question-base';
import { QuestionAutocomplete } from '../logic/question-autocomplete';

import { SquadClientService } from 'src/app/screens/order-tour/squad-assemble/components/squad-client/squad-client.service';
import { TripService } from 'src/app/services/trip.service';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { SquadDetailsService } from 'src/app/screens/order-tour/squad-assemble/components/squad-details/squad-details.service';
import { BaseCustomer, UserService } from 'src/app/open-api';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() public formGroup: FormGroup = null;
  @Input() public options$: Observable<SelectOption[]>;

  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter();
  @Output() select: EventEmitter<FormControl> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  //internal
  //@Output() deleteCustomer: EventEmitter<string> = new EventEmitter();
 

  //public list: any[] = [];
  //flag :boolean=false;

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService,
    public tripService: TripService,
    public squadDetailsService: SquadDetailsService,
    public squadAssembleService: SquadAssembleService,
    private userService:UserService,
    
  ) { }

  ngOnInit(): void {
    this.formGroup =
      this.formGroup ||
      this.formService.setFormGroup({
        questions: this.group.questions,
      });
  }
  // getName(control: AbstractControl): string | null {
  //   let group = <FormGroup>control.parent;
  //   if (!group) {
  //     return null;
  //   }
  //   let name: string;
  //   Object.keys(group.controls).forEach(key => {
  //     let childControl = group.get(key);
  //     if (childControl !== control) {
  //       return;
  //     }
  //     name = key;
  //   });
  //   return name;
  // }

  public onAutocomplete(control: FormControl) {
   
    this.autocomplete.emit(control);
  }
  public onSelect(control: FormControl) {
  
    this.select.emit(control);
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
   
    const autocomplete: QuestionAutocomplete = this.group.questions.find(
      (q) => q instanceof QuestionAutocomplete
    );
    const option = autocomplete.inputProps.options.find(
      (opt) => opt.value === event.option.value
    );


    console.log(option);

    this.optionSelected.emit({ key: autocomplete.key, option });
  }
  
  public onDelete(option: SelectOption) {
    const autocomplete: QuestionAutocomplete = this.group.questions.find(
      (q) => q instanceof QuestionAutocomplete
    );
    this.delete.emit({ optionToDelete : option, question: autocomplete });
  }

 
}
