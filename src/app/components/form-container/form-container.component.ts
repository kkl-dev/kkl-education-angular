import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';


@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  providers: [QuestionControlService]
})


export class FormContainerComponent implements OnInit {

  public form!: FormGroup;
  public formTemplate!: FormGroup;

  @Input() cols: string = "1"
  @Input() questions!: QuestionBase<string>[]
  @Input() showButton: boolean = true
  @Input() customQuestionTemplates = {}
  payLoad: string = '';

  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    // this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
    this.formTemplate = this.qcs.setGroup(this.questions)
  }

  onSubmit() {
    console.log(this.formTemplate.value);

  }

}
