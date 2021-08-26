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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  public form!: FormGroup;
  @Output() formData: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<FormGroup> = new EventEmitter();

  @Input() formTemplate!: QuestionBase<string>[][];
  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() hasButton: boolean = false;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };
  @Input() customQuestionTemplates = {};

  constructor(private formService: FormService) {}

  ngOnInit() {
    console.log(this.formTemplate)
    this.subscribeToFormValues();
  }

  onSubmit() {
    this.formData.emit(this.form.value);
  }

  private subscribeToFormValues() {
    this.form.valueChanges.subscribe((values) => {
      this.formData.emit(values);
      this.valueChange.emit(this.form)
    });
  }
}
