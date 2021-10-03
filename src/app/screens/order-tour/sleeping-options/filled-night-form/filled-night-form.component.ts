import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-filled-night-form',
  templateUrl: './filled-night-form.component.html',
  styleUrls: ['./filled-night-form.component.scss'],
})
export class FilledNightFormComponent implements OnInit, OnChanges {
  public filledNightForm: FormGroup;
  public editMode: boolean = false;
  @Input() valuesForEdit: any;
  @Input() totalAmount: number = 0;
  @Output() emitFormValues: EventEmitter<FormGroup> = new EventEmitter();
  @Output() emitFormUpdate: EventEmitter<any> = new EventEmitter();

  saveForValue: string = '';

  sleepingTypeOptions = [
    { value: 'בקתה', text: 'בקתה' },
    { value: 'אוהל', text: 'אוהל' },
    { value: 'חדר', text: 'חדר' },
  ];

  nightNumberOptions = [
    { value: '1 לילה ', nightNumber: 1, date: new Date(2021, 11, 15), completed: false },
    { value: '2 לילה ', nightNumber: 2, date: new Date(2021, 11, 16), completed: false },
    { value: '3 לילה ', nightNumber: 3, date: new Date(2021, 11, 17), completed: false },
  ];
  public allComplete: boolean = false;

  saveForOptions = [
    { value: 'מבוגרים' },
    { value: 'ילדים' },
    { value: 'מורים' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.filledNightForm = new FormGroup({
      sleepingPlace: new FormControl(null),
      nightsCount: new FormControl(null),
      saveFor: new FormControl(null),
      sleepingAmount: new FormControl(null),
      amount: new FormControl(null),
      comments: new FormControl(null),
      optionsArr: new FormControl([])
    });
    if (this.valuesForEdit !== undefined && this.valuesForEdit !== null) {
      this.updateItem(this.valuesForEdit[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.valuesForEdit.currentValue && changes.valuesForEdit.currentValue[0] !== undefined) {
    //   console.log(changes.valuesForEdit.currentValue)
    //   this.updateItem(changes.valuesForEdit.currentValue[0],changes.value.currentValue[1],changes.value.currentValue[2]);
    // }
  }

  public updateItem(item: any) {
    this.editMode = true;
    const { controls } = this.filledNightForm || {};
    if (controls) {
      controls.nightsCount.setValue(item.nightsCount)
      controls.sleepingPlace.setValue(item.sleepingPlace)
      controls.saveFor.setValue(item.saveFor)
      controls.sleepingAmount.setValue(item.sleepingAmount)
      controls.amount.setValue(item.amount)
      controls.comments.setValue(item.comments)
      controls.optionsArr.setValue(item.optionsArr)
    }
  }
  
  public sumbitUpdatedItem(): void {
    this.updateNightCount();    
    this.valuesForEdit[2] !== undefined ? this.emitFormUpdate.emit([this.filledNightForm, this.valuesForEdit[1], this.valuesForEdit[2]])
      : this.emitFormUpdate.emit([this.filledNightForm, this.valuesForEdit[1]]);
    this.editMode = false;
    this.valuesForEdit = null;
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
    const options = this.filterSelectedOptions();
    if(options.length !== 0){
      this.filledNightForm.controls.nightsCount.setValue(options);
    }
  }
  public filterSelectedOptions() {
    let tmpArr = this.nightNumberOptions.filter(i => i.completed);
    return tmpArr.map(i => i);
  }
}
