import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  @Input() formGroup: FormGroup = null;
  @Input() group: QuestionGroup;
  @Input() questions: QuestionBase<string | number | Date>[];
  @Input() $questions: Observable<QuestionBase<string | number | Date>[]>;

  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() topButton: boolean = false;
  @Input() hasBottomButton: boolean = false;

  @Input() disable: boolean;


  @Input() slots: {
    button?: ElementRef;
    groupInputs?: ElementRef;
  };

  @Output() register: EventEmitter<FormGroup> = new EventEmitter();
  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter();

  constructor(private formService: FormService) { }

  ngOnInit() {
    this.initFormGroup();
    this.subscribeToQuestions();
    this.subscribeToFormValues();
    this.disableForm()

  }

  private initFormGroup() {
    if (!this.formGroup && this.questions.length > 0) {
      this.formGroup = this.formService.setFormGroup({
        questions: this.questions,
      });
      this.register.emit(this.formGroup);
    }
  }

  private disableForm() {
    if (this.disable) {
      this.formGroup.disable()
    }
  }

  public onSubmit() {
    this.register.emit(this.formGroup);
  }

  private subscribeToQuestions() {
    if (this.$questions) {
      this.$questions.subscribe((questions) => {
        this.questions = questions;
        this.formGroup = this.formService.setFormGroup({
          questions: this.questions,
        });
      });

    }
  }

  private subscribeToFormValues() {
    this.formGroup.valueChanges.subscribe(() => {
      this.register.emit(this.formGroup);
    });
  }

  public onEdit() {
    this.form.enable();
  }

  public onAutocomplete(control) {
    this.autocomplete.emit(control)
  }
}
