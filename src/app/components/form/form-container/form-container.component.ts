import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../logic/question-base';
import { QuestionControlService } from '../logic/question-control.service';


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

  @Output() emitFormValues: EventEmitter<any> = new EventEmitter()
  @Input() buttonText: string = 'המשך'

  public payLoad: string = '';
  constructor
  (private qcs: QuestionControlService,
    ) {
  }

  ngOnInit() {
    // this.formTemplate = this.qcs.setGroup(this.questions)
    console.log(this.formTemplate)
    // this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string | Date>[]);
  }

  ngOnChanges() {
    console.log('onChanges');
    // this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string | Date>[]);
  }
  onSubmit() {

    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log(this.payLoad);

    console.log('asdasd');

    this.emitFormValues.emit(this.form.getRawValue())

  }

}
