import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, QuestionGroup } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit {
  public form: FormGroup;

  @Input() formGroup!: FormGroup;
  @Input() group!: QuestionGroup;
  @Input() questions!: QuestionBase<string>[];

  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() hasButton: boolean = false;
  @Input() hasBottomButton: boolean = false;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };

  @Output() formData: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<FormGroup> = new EventEmitter();

  constructor(private formService: FormService) {}

  ngOnInit() {
    if (!this.formGroup && this.questions.length > 0) {
      this.formGroup = this.formService.setFormGroup({
        questions: this.questions,
      });
      this.valueChange.emit(this.formGroup);
    }
  }

  onSubmit() {
    this.valueChange.emit(this.formGroup);
  }
}
