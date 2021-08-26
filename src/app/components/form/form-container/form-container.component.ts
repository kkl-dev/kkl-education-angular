import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionGroup } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() group!: QuestionGroup;
  @Input() questions!: QuestionBase<string>[];

  @Input() cols: string;
  @Input() gutter: string = '5';
  @Input() hasButton: boolean = false;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };

  @Output() formData: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<FormGroup> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    console.log(this.formGroup.value);
    this.valueChange.emit(this.formGroup);
  }
}
