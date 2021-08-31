import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormService } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';
import { QuestionGroup } from '../logic/question-group';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit {
  public form: FormGroup;

  @Input() formGroup: FormGroup;
  @Input() group: QuestionGroup;
  @Input() questions: QuestionBase<string | number | Date>[];
  @Input() $questions: Observable<QuestionBase<string | number | Date>[]>;

  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() hasButton: boolean = false;
  @Input() hasBottomButton: boolean = false;

  @Input() slots: {
    topButton?: ElementRef;
    group?: ElementRef;
  };

  @Output() valueChange: EventEmitter<FormGroup> = new EventEmitter();

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.initFormGroup();
    this.subscribeToQuestions();
    console.log(this.formService.id)


  }

  private initFormGroup() {
    if (!this.formGroup && this.questions.length > 0) {
      this.formGroup = this.formService.setFormGroup({
        questions: this.questions,
      });
      this.valueChange.emit(this.formGroup);
    }
  }

  public onSubmit() {
    this.valueChange.emit(this.formGroup);
  }

  private subscribeToQuestions() {
    this.$questions.subscribe((questions) => {
      this.questions = questions;
      this.formGroup = this.formService.setFormGroup({
        questions: this.questions,
      });
    });
  }

  public onEdit() {
    this.form.enable();
  }
}
