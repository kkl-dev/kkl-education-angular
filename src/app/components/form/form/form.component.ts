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

  @Output() valueChange: EventEmitter<FormGroup> = new EventEmitter();

  @Input() formTemplate!: FormTemplate;
  @Input() cols: string;
  @Input() gutter: string = '3';
  @Input() hasButton: boolean = false;
  @Input() editMode: boolean ;
  @Input() slots: {
    button?: ElementRef;
    group?: ElementRef;
  };
  @Input() customQuestionTemplates = {};

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.form = this.formService.setFormGroup(this.formTemplate);
    this.valueChange.emit(this.form);
    this.subscribeToFormValues();
  }

  onSubmit() {
    this.valueChange.emit(this.form.value);
  }

  private subscribeToFormValues() {
    this.form.valueChanges.subscribe(() => {
      this.valueChange.emit(this.form);
    });
  }

}
