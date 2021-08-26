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
  @Output() formData: EventEmitter<any> = new EventEmitter();
  @Output() formGroup: EventEmitter<FormGroup> = new EventEmitter();

  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() questions!: QuestionBase<string>[];
  @Input() hasButton: boolean = false;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };
  @Input() customQuestionTemplates = {};

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.form = this.formService.buildForm(this.questions);
    this.subscribeToFormValues();
  }

  onSubmit() {
    this.formData.emit(this.form.value);
  }

  private subscribeToFormValues() {
    this.form.valueChanges.subscribe((values) => {
      this.formData.emit(values);
      this.formGroup.emit(this.form)
    });
  }
}
