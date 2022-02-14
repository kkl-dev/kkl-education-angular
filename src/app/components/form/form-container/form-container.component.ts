import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { FormService } from '../logic/form.service';
import { QuestionAutocomplete } from '../logic/question-autocomplete';
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
  //@Input() hasButton: boolean = false;
  @Input() topButton: boolean = false;
  @Input() hasBottomButton: boolean = false;

  @Input() disable: boolean;


  @Input() slots: {
    // topButton?: ElementRef;
    button?: ElementRef;
    groupInputs?: ElementRef;
  };
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @Output() dateInputChanged: EventEmitter<any> = new EventEmitter()
  @Output() register: EventEmitter<FormGroup> = new EventEmitter();
  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter();
  //@Output() optionSelected: EventEmitter<any> = new EventEmitter();

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
    console.log("onSubmit");
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

  dateObjChanged(newDate: any) {
    console.log(newDate);
    this.dateInputChanged.emit(newDate)
  }

  public onAutocomplete(control) {
    console.log("onAutocomplete: ", control);
    this.autocomplete.emit(control);
  }
  
  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    console.log('I am option selected');
  
   const autocomplete: any = this.questions.find(
     i=>i.controlType==='autocomplete'
   );
   const option = autocomplete.inputProps.options.find(
     (opt) => opt.value === event.option.value
   );


    console.log(option);

   this.optionSelected.emit({ key: autocomplete.key, option });
  
 }

 
}
