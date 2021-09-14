import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-filled-night-form',
  templateUrl: './filled-night-form.component.html',
  styleUrls: ['./filled-night-form.component.scss'],
})
export class FilledNightFormComponent implements OnInit {
  filledNightForm: FormGroup;
  @Input() totalAmount: number = 0;
  @Output() emitFormValues: EventEmitter<FormGroup> = new EventEmitter();
  saveForValue: string = '';

  sleepingTypeOptions = [
    { value: 'בקתה', text: 'בקתה' },
    { value: 'אוהל', text: 'אוהל' },
    { value: 'חדר', text: 'חדר' },
  ];

  nightNumberOptions = [
    { value: '1 לילה ', text: 'לילה 1' },
    { value: '2 לילה ', text: 'לילה 2' },
    { value: '3 לילה ', text: 'לילה 3' },
  ];

  saveForOptions = [
    { value: 'grownUps', text: 'מבוגרים' },
    { value: 'childs', text: 'ילדים' },
    { value: 'teachers', text: 'מורים' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.filledNightForm = new FormGroup({
    //   sleepingPlace: new FormControl(null, [Validators.required]),
    //   nightsCount: new FormControl(null, [Validators.required]),
    //   saveFor: new FormControl(null, [Validators.required]),
    //   sleepingAmount: new FormControl(null, [Validators.required]),
    //   amount: new FormControl(null, [Validators.required]),
    //   comments: new FormControl(null, [Validators.required]),
    // });
  //test
    this.filledNightForm = new FormGroup({
      filledUnits: this.formBuilder.array([
        this.getLodging()
      ]),
      comments: new FormControl(null, [Validators.required]),
    });
    //test 
  }
   getLodging(){
    return this.formBuilder.group({
      sleepingPlace: [null, Validators.required],
      nightsCount: [null, [Validators.required]],
      saveFor: [null, [Validators.required]],
      sleepingAmount: [null, [Validators.required]],
      amount: [null, [Validators.required]]
    });
  }

  saveForChangeHandler(text: any) {
    // this.saveForValue = this.saveForOptions.filter(
    //   (item) => item.value === this.filledNightForm.value.saveFor
    // )[0].text;
    // console.log(this.saveForValue);
  }

  onSubmit() {
    //this.emitFormValues.emit(this.filledNightForm);
    const control = <FormArray>this.filledNightForm.controls["filledUnits"];
    control.push(this.getLodging());
    console.log(this.filledNightForm.value);
    //this.filledNightForm.reset();
  }
  // onChange(value) {
  //   console.log(value);
  // }
}
