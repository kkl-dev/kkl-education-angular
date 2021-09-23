import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationType, ParticipantType, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  sleepingTypeOptions: AccommodationType[];
  saveForOptions: ParticipantType[];
  nightNumberOptions: any[]=[]

  // nightNumberOptions = [
  //   { value: '1 לילה ', text: 'לילה 1' },
  //   { value: '2 לילה ', text: 'לילה 2' },
  //   { value: '3 לילה ', text: 'לילה 3' },
  // ];

  constructor(private _userService:UserService, private squadAssembleService:SquadAssembleService ) {}

  ngOnInit(): void {
    this.filledNightForm = new FormGroup({
      // sleepingPlace: new FormControl(null, [Validators.required]),
      // nightsCount: new FormControl(null, [Validators.required]),
      // saveFor: new FormControl(null, [Validators.required]),
      // sleepingAmount: new FormControl(null, [Validators.required]),
      // amount: new FormControl(null, [Validators.required]),
      // comments: new FormControl(null, [Validators.required]),

      accomodationTypeId: new FormControl(null, [Validators.required]),
      accomodationTypeName: new FormControl(null),
      date: new FormControl(null, [Validators.required]),
      participantId: new FormControl(null, [Validators.required]),
      participantName: new FormControl(null),
      lodgersNumber: new FormControl(null, [Validators.required]),
      unitsNumber: new FormControl(null, [Validators.required]),
       comments: new FormControl(null, [Validators.required]),
    });

    this._userService.getLookupAccommodationType(1).subscribe(res=>{
      console.log(res);
       this.sleepingTypeOptions= res;
    },(err)=>{
        console.log(err);
    })
    this._userService.getParticipantTypes().subscribe(res=>{
     console.log(res);
      this.saveForOptions=res;
   },(err)=>{
     console.log(err);
   })
   
    let startDate= this.squadAssembleService.tripInfo.tripStart;
    let endDate= this.squadAssembleService.tripInfo.tripEnding;
     this.setnightNumberOptions(startDate,endDate)
  }


  setnightNumberOptions(startDate,endDate){
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
       let date1 = new Date(startDate);
       let date2 = new Date(endDate);
        const utc1 = Date.UTC(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate(),
       );
      const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
     );

     const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
     let newDate = new Date(date1.setDate(date1.getDate()));
     for (let i = 0; i <= (totalDays-1); i++) {
      
       const newDateStringIsraelFormat = `${newDate.getDate()}.${
        newDate.getMonth() + 1
       }.${newDate.getFullYear()}`;
       const newDateStringUsaFormat = `${newDate.getFullYear()}-${
        newDate.getMonth() + 1
       }-${newDate.getDate()}`;
       let obj={
         id:newDateStringUsaFormat,
         name:(i+1) +'לילה'+' : '+newDateStringIsraelFormat
       }
       this.nightNumberOptions.push(obj);
       newDate = new Date(date1.setDate(date1.getDate() + 1));
     }
     console.log(this.nightNumberOptions);
  }

  saveForChangeHandler(text: any) {
    this.saveForValue = this.saveForOptions.filter(
      (item) => item.id === this.filledNightForm.value.saveFor
    )[0].name;
    console.log(this.saveForValue);
  }

  onSubmit() {
     let sleepingTypeSelected= this.sleepingTypeOptions.find((item)=>item.id== this.filledNightForm.get('accomodationTypeId').value);
     let participantIdSelected= this.saveForOptions.find((item)=>item.id== this.filledNightForm.get('participantId').value)
    this.filledNightForm.get('accomodationTypeName').setValue(sleepingTypeSelected.name);
    this.filledNightForm.get('participantName').setValue(participantIdSelected.name);
    this.emitFormValues.emit(this.filledNightForm);
    this.filledNightForm.reset();
  }

    validateForm(){
       //let paticipantIdSelected= 
   }
  // onChange(value) {
  //   console.log(value);
  // }
}

