import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { getStickyHeaderDates } from '@fullcalendar/core';
import {AccommodationType, ParticipantType, TripInfo, UserService} from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';
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
  tripInfo : TripInfo
  // sleepingTypeOptions = [
  //   { value: 'בקתה', text: 'בקתה' },
  //   { value: 'אוהל', text: 'אוהל' },
  //   { value: 'חדר', text: 'חדר' },
  // ];

  // nightNumberOptions = [
  //   { value: '1 לילה ', text: 'לילה 1' },
  //   { value: '2 לילה ', text: 'לילה 2' },
  //   { value: '3 לילה ', text: 'לילה 3' },
  // ];

  // saveForOptions = [
  //   { value: 'grownUps', text: 'מבוגרים' },
  //   { value: 'childs', text: 'ילדים' },
  //   { value: 'teachers', text: 'מורים' },
  // ];

  constructor(private formBuilder: FormBuilder, private _userService:UserService, private squadAssembleService:SquadAssembleService  ) {}

  ngOnInit(): void {
    // this.filledNightForm = new FormGroup({
    //   sleepingPlace: new FormControl(null, [Validators.required]),
    //   nightsCount: new FormControl(null, [Validators.required]),
    //   saveFor: new FormControl(null, [Validators.required]),
    //   sleepingAmount: new FormControl(null, [Validators.required]),
    //   amount: new FormControl(null, [Validators.required]),
    //   comments: new FormControl(null, [Validators.required]),
    // });

    this.filledNightForm = new FormGroup({
      filledUnits: this.formBuilder.array([
        this.getLodging()
      ]),
      comments: new FormControl(null),
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
     //let startDate= '2021/09/22';
     let endDate= this.squadAssembleService.tripInfo.tripEnding;
     //let endDate= '2021/09/25';
    this.setnightNumberOptions(startDate,endDate)
    
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
         name: newDateStringIsraelFormat
       }
       this.nightNumberOptions.push(obj);
       newDate = new Date(date1.setDate(date1.getDate() + 1));
      // else{
      //   let obj={
      //     id:5,
      //     name: 'הכל'
      //   }
      //   this.nightNumberOptions.push(obj);
      // }
     }
     console.log(this.nightNumberOptions);
  }

  saveForChangeHandler(text: any) {
    // this.saveForValue = this.saveForOptions.filter(
    //   (item) => item.value === this.filledNightForm.value.saveFor
    // )[0].text;
    // console.log(this.saveForValue);
  }

  addRow(){
    const control = <FormArray>this.filledNightForm.controls["filledUnits"];
    control.push(this.getLodging());
  }
  onSubmit() {
    //this.emitFormValues.emit(this.filledNightForm);
   
    console.log(this.filledNightForm.value);
    this.tripInfo= this.squadAssembleService.tripInfo;
    // let obj ={
    //   customerId:5,
    //   customerName: 'eyal'
    // }

    // this.tripInfo=obj;
    //console.log('tripInfoAfterObj:', this.tripInfo);
   // this.tripInfo= this.squadAssembleService.formsArray[0].value
    this.tripInfo.lodgingReservation= this.filledNightForm.controls['filledUnits'].value;
    this.tripInfo.commentManager= this.filledNightForm.controls['comments'].value;
    this._userService.createTrip(this.tripInfo).subscribe(res=>{
       console.log(res);
    },(err)=>{
      console.log(err);
    })
    //this.filledNightForm.reset();
  }
  // onChange(value) {
  //   console.log(value);
  // }
}
