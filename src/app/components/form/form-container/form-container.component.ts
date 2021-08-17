import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})


export class FormContainerComponent implements OnInit {

  public form!: FormGroup;
  public formTemplate!: FormGroup;

  @Input() cols: string = "1"
  @Input() questions!: QuestionBase<string>[]
  @Input() showButton: boolean = true
  @Input() customQuestionTemplates = {}
  payLoad: string = '';

  constructor(private formService: FormService) {
  }

  ngOnInit() {
    this.formTemplate = this.formService.setGroup(this.questions)
  }

  onSubmit() {
    console.log(this.formTemplate.value);

  }

}
