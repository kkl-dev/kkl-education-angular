import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService, FormTemplate } from '../logic/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
})
export class FormComponent implements OnInit {
  public form!: FormGroup;

  @Output() register: EventEmitter<FormGroup> = new EventEmitter();

  @Input() formTemplate!: FormTemplate;
  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() hasButton: boolean = false;
  @Input() editMode: boolean;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };
  @Input() customQuestionTemplates = {};

  constructor(private formService: FormService) {}

  ngOnInit() {
    // console.log(this.slots);
    
    this.form = this.formService.setFormGroup(this.formTemplate);


    this.register.emit(this.form);
    this.subscribeToFormValues();

    if (this.editMode) {
      this.form.disable();
    }
  }

  onSubmit() {
    this.register.emit(this.form.value);
  }

  private subscribeToFormValues() {
    this.form.valueChanges.subscribe(() => {
      this.register.emit(this.form);
    });
  }
}
