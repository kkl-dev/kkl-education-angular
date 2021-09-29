import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationType, NightNumberOptions, ParticipantType, UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
@Component({
  selector: 'app-filled-night-form',
  templateUrl: './filled-night-form.component.html',
  styleUrls: ['./filled-night-form.component.scss'],
})
export class FilledNightFormComponent implements OnInit, OnChanges {
  public filledNightForm: FormGroup;
  accomodationTypeOptions: AccommodationType[];
  participantOptions: ParticipantType[];
  nightNumberOptions: NightNumberOptions[]=[];
  @Input() valuesForEdit: any;
  @Input() totalAmount: number = 0;
  @Output() emitFormValues: EventEmitter<FormGroup> = new EventEmitter();
  saveForValue: string = '';

  // sleepingTypeOptions = [
  //   { value: 'בקתה', text: 'בקתה' },
  //   { value: 'אוהל', text: 'אוהל' },
  //   { value: 'חדר', text: 'חדר' },
  // ];

  // nightNumberOptions = [
  //   { value: '1 לילה ', nightNumber: 1, date: new Date(2021, 11, 15), selected: false },
  //   { value: '2 לילה ', nightNumber: 2, date: new Date(2021, 11, 16), selected: false },
  //   { value: '3 לילה ', nightNumber: 3, date: new Date(2021, 11, 17), selected: false },
  // ];
  public allComplete: boolean = false;

  // saveForOptions = [
  //   { value: 'מבוגרים' },
  //   { value: 'ילדים' },
  //   { value: 'מורים' },
  // ];

  constructor(private _tripService :TripService, private _userService:UserService ) { }

  ngOnInit(): void {
    // this.filledNightForm = new FormGroup({
    //   sleepingPlace: new FormControl(null),
    //   nightsCount: new FormControl(null),
    //   saveFor: new FormControl(null),
    //   sleepingAmount: new FormControl(null),
    //   amount: new FormControl(null),
    //   comments: new FormControl(null),
    //   optionsArr: new FormControl([])
    // });

    this.filledNightForm = new FormGroup({
      accomodationType: new FormControl(null),
      nightsCount: new FormControl(null),
      participant: new FormControl(null),
      lodgersNumber: new FormControl(null),
      unitsNumber: new FormControl(null),
      comments: new FormControl(null),
    });

    this._userService.getLookupAccommodationType(this._tripService.centerField.id).subscribe(res=>{
       this.accomodationTypeOptions=res;
       console.log('accomodationTypeOptions is: ',this.accomodationTypeOptions);
    })
    this._userService.getParticipantTypes().subscribe(res=>{
      this.participantOptions=res;
      console.log('participantOptions is: ',this.participantOptions);
    })
    this.setnightNumberOptions(this._tripService.sleepingDates.from,this._tripService.sleepingDates.till)

    if(this.valuesForEdit) {
      this.updateItem(this.valuesForEdit);
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valuesForEdit.currentValue !== undefined) {
      this.updateItem(changes.valuesForEdit.currentValue);
      // console
    }
  }

  setnightNumberOptions(from,till){
   
    let date1 = new Date(from);
    let date2 = new Date(till);
    console.log(date1.getMonth());
    console.log(date1.getDate());
    console.log(date1.getFullYear());

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    console.log(totalDays);
    let newDate = new Date(date1.setDate(date1.getDate()));
    for (let i = 0; i < totalDays; i++) {
      //להכניס שורה שמחליפה תאירך לסטרינג של תאריך לתצוגה
      const newDateString = `${newDate.getDate()}.${
        (newDate.getMonth()+1).toString()
      }.${newDate.getFullYear()}`;
      this.nightNumberOptions.push({
        nightNumber: (i+1),
        nightNumberValue: 'לילה' + (i+1),
        date: newDateString,
        selected: false
      });
      newDate = new Date(date1.setDate(date1.getDate() + 1));
    }
  
  }

  public updateItem(item: any) {
    const { controls } = this.filledNightForm || {}; 

    // if (controls) {
    //   controls.nightsCount.setValue(item.nightsCount)
    //   controls.sleepingPlace.setValue(item.sleepingPlace)
    //   controls.saveFor.setValue(item.saveFor)
    //   controls.sleepingAmount.setValue(item.sleepingAmount)
    //   controls.amount.setValue(item.amount)
    //   controls.comments.setValue(item.comments)
    //   controls.optionsArr.setValue(item.optionsArr)
    // }
    if (controls) {
      controls.nightsCount.setValue(item.nightsCount)
      controls.accomodationType.setValue(item.accomodationType)
      controls.participant.setValue(item.participant)
      controls.lodgersNumber.setValue(item.lodgersNumber)
      controls.unitsNumber.setValue(item.unitsNumber)
      controls.comments.setValue(item.comments)
     // controls.optionsArr.setValue(item.optionsArr)
    }
    console.log(this.filledNightForm)
  }

  onSubmit() {
    this.updateNightCount();
    this.emitFormValues.emit(this.filledNightForm);
    this.filledNightForm.reset();
  }
  public selectAllOptions(): void {
    if (!this.allComplete) {
      this.nightNumberOptions.forEach(t => t.selected = true);
      this.allComplete = true;
    } else {
      this.nightNumberOptions.forEach(t => t.selected = false);
      this.allComplete = false;
    }
    this.updateNightCount()
  }
  public updateNightCount(): void {
    this.filledNightForm.controls.nightsCount.setValue(this.filterSelectedOptions())
  }
  public filterSelectedOptions() {
    let tmpArr = this.nightNumberOptions.filter(i => i.selected);
    return tmpArr.map(i => i);
  }
  // onChange(value) {
  //   console.log(value);
  // }
}
