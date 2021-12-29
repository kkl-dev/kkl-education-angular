import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';
import { SquadClientService } from 'src/app/screens/order-tour/squad-assemble/components/squad-client/squad-client.service';
import { Observable, of } from 'rxjs';
import { SelectOption } from '../logic/question-base';
import { QuestionAutocomplete } from '../logic/question-autocomplete';

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
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.formGroup =
      this.formGroup ||
      this.formService.setFormGroup({
        questions: this.group.questions,
      });
  }

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

    this.optionSelected.emit({ key: autocomplete.key, option });
  }

  public onDelete(option: SelectOption) {
    const autocomplete: QuestionAutocomplete = this.group.questions.find(
      (q) => q instanceof QuestionAutocomplete
    );
    console.log(autocomplete);
    this.delete.emit({ option, question: autocomplete });
  }
}
