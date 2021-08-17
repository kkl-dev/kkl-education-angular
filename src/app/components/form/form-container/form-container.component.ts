import { FormService } from './../logic/form.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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

  @Input() cols: string = "1"
  @Input() questions!: QuestionBase<string>[]
  @Input() showButton: boolean = true
  @Input() customQuestionTemplates = {}

  @Output() emitFormValues: EventEmitter<any> = new EventEmitter()
  @Input() buttonText: string = 'המשך'

  public payLoad: string = '';

  constructor
    (
      private formService: FormService
    ) {
  }

  ngOnInit() {
    this.form = this.formService.setGroup(this.questions)
  }


  onSubmit() {

    this.payLoad = JSON.stringify(this.form.value());
    console.log(this.payLoad);

    console.log('asdasd');

    this.emitFormValues.emit(this.form.value())

  }

}
