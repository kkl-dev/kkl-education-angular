import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
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
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  @Input() cols: string = '1';
  @Input() gutter: string = '3';
  @Input() questions!: QuestionBase<string>[];
  @Input() showButton: boolean = false;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };
  @Input() customQuestionTemplates = {};
  @Input() buttonText: string = '';

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.form = this.formService.buildGroup(this.questions);
  }

  onSubmit() {
    console.log(this.form.value);
    
    this.emitFormValues.emit(this.form.value);
  }
}
