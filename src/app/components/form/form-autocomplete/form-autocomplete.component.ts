import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';
import { SquadClientService } from 'src/app/screens/order-tour/squad-assemble/components/squad-client/squad-client.service';
import { Observable, of } from 'rxjs';
import { SelectOption } from '../logic/question-base';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() public formGroup: FormGroup = null;

  public options$: Observable<SelectOption[]> = of([]);

  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter();
  @Output() select: EventEmitter<FormControl> = new EventEmitter();
  @Output() delete: EventEmitter<SelectOption> = new EventEmitter();
  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent> =
    new EventEmitter();

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService
  ) {}

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
    this.optionSelected.emit(event);
    // this.squadClientService.emitClientSelected(event.option.value);
  }
  public onDelete(option: SelectOption) {
    this.delete.emit(option);
  }
}
