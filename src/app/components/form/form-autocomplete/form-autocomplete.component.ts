import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/question-group';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;

  public formGroup: FormGroup;
  public list: string[] = [];

  constructor(
    private formService: FormService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formService.setFormGroup({
      questions: this.group.questions,
    });
  }

  public onAutocomplete(control: FormControl) {
    console.log(control)
    
    // TODO search server logic
    this.list.push(control.value)
  }
  
  public onSelect(control: FormControl) {
    console.log(control)

  }
  public onDelete() {
    // TODO delete server logic

  }
}
