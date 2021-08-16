import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';


@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  providers: [ QuestionControlService ]
})


export class FormContainerComponent implements OnInit, OnChanges {
  
  @Output() emitFormValues:EventEmitter<any> =new EventEmitter()
  @Input() questions: QuestionBase<string | Date>[] | null = [];
  @Input() showButton:boolean=true
  @Input() buttonText:string='המשך'
 public form!: FormGroup; 
  @Input() customQuestionTemplates={}
  payLoad:string = '';

  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string | Date>[]);
  }

  ngOnChanges(){
    console.log('onChanges');
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string | Date>[]);
  }
  onSubmit() {
    
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log('asdasd');
    
    this.emitFormValues.emit(this.form.getRawValue())
    
  }

}
