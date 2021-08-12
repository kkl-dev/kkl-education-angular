import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base';
import { QuestionControlService } from './question-control.service';


@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  providers: [ QuestionControlService ]
})


export class FormContainerComponent implements OnInit {
  
  @Input() questions: QuestionBase<string>[] | null = [];
  @Input() showButton:boolean=true
  form!: FormGroup; 
  payLoad = '';

  constructor(private qcs: QuestionControlService) {
    console.log(this.questions);
    
  }

  ngOnInit() {
    // console.log(this.questions);
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log(this.payLoad);
    
  }

}
