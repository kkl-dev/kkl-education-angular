import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';
import { SquadClientService } from 'src/app/screens/order-tour/squad-assemble/components/squad-client/squad-client.service';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() public formGroup: FormGroup = null;

  public list: string[] = [];

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
    // TODO search server logic
  }

  public onSelect(control: FormControl) {
    // TODO select server logic
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    // TODO get client from server logic
    this.squadClientService.emitClientSelected(event.option.value);
    this.list.push(event.option.value);
  }
  public onDelete() {
    // TODO delete server logic
  }
}
