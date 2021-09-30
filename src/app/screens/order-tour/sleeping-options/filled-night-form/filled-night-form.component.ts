import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
    { value: '1 לילה ', text: 'לילה 1', date: '1/1/21', completed: false },
    { value: '2 לילה ', text: 'לילה 2', date: '1/1/21', completed: false },
    { value: '3 לילה ', text: 'לילה 3', date: '1/1/21', completed: false },
  ];
  public allComplete: boolean = false;

  saveForOptions = [
    { value: 'grownUps', text: 'מבוגרים' },
    { value: 'childs', text: 'ילדים' },
    { value: 'teachers', text: 'מורים' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.filledNightForm = new FormGroup({
      sleepingPlace: new FormControl(null, [Validators.required]),
      nightsCount: new FormControl(null, [Validators.required]),
      saveFor: new FormControl(null, [Validators.required]),
      sleepingAmount: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      comments: new FormControl(null, [Validators.required]),
      date: new FormControl(null)
    });
  }

  saveForChangeHandler(text: any) {
    this.saveForValue = this.saveForOptions.filter(
      (item) => item.value === this.filledNightForm.value.saveFor
    )[0].text;
  }

  onSubmit() {
    this.updateNightCount();
    this.emitFormValues.emit(this.filledNightForm);
    this.filledNightForm.reset();
  }
  public selectAllOptions(): void {
    if (!this.allComplete) {
      this.nightNumberOptions.forEach(t => t.completed = true);
      this.allComplete = true;
    } else {
      this.nightNumberOptions.forEach(t => t.completed = false);
      this.allComplete = false;
    }
    this.updateNightCount()
  }
  public updateNightCount(): void {
    this.filledNightForm.controls.nightsCount.setValue(this.filterSelectedOptions())
  }
  public filterSelectedOptions() {
    let tmpArr = this.nightNumberOptions.filter(i => i.completed);
    return tmpArr.map(i => i.value);
  }
  // onChange(value) {
  //   console.log(value);
  // }
}
