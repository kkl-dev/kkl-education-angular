import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccommodationType, NightNumberOptions, ParticipantType, UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  public editMode: boolean = false;
  IsUnitsNumIsValid :boolean =true;
  @Input() valuesForEdit: any;
  //@Input() totalAmount: number = 0;
   totalAmount: number ;
  @Output() emitFormValues: EventEmitter<FormGroup> = new EventEmitter();
  @Output() emitFormUpdate: EventEmitter<any> = new EventEmitter();

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

  constructor(private _tripService :TripService, private _userService:UserService,private _sleepingService: SleepingServiceService , private squadAssembleService:SquadAssembleService, private _dialog: MatDialog ) { }

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
      accomodationType: new FormControl(null,[Validators.required]),
      nightsCount: new FormControl(null,[Validators.required]),
      participant: new FormControl(null,[Validators.required]),
      lodgersNumber: new FormControl(null,[Validators.required]),
      unitsNumber: new FormControl(null,[Validators.required]),
      comments: new FormControl(null),
    });
    if(!this._sleepingService.accomodationTypeOptions){
      this._userService.getLookupAccommodationType(this._tripService.centerField.id).subscribe(res=>{
        this.accomodationTypeOptions=res;
        this._sleepingService.setAccomodationByFieldCenter(this.accomodationTypeOptions);
        console.log('accomodationTypeOptions is: ',this.accomodationTypeOptions);
     })
    }
    else{
      this.accomodationTypeOptions= this._sleepingService.accomodationTypeOptions;
    }
   if(!this._sleepingService.participantOptions){
    this._userService.getParticipantTypes().subscribe(res=>{
      this.participantOptions=res;
      this._sleepingService.setParticipantsOptions(this.participantOptions);
      console.log('participantOptions is: ',this.participantOptions);
    })
   }
   else{
     this.participantOptions=this._sleepingService.participantOptions;
   }
   
    this.setnightNumberOptions(this._tripService.sleepingDates.from,this._tripService.sleepingDates.till)

    if (this.valuesForEdit !== undefined && this.valuesForEdit !== null) {
      this.updateItem(this.valuesForEdit[0]);
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valuesForEdit.currentValue !== undefined) {
      this.updateItem(changes.valuesForEdit.currentValue);
      // console
    }
  }

  setnightNumberOptions(from,till){
     let str = from.split("/");
     let str2 = till.split("/");
      from = str[2] + '-' + str[1] + '-' + str[0];
      till = str2[2] + '-' + str2[1] + '-' + str2[0];
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
      const newDateString = `${newDate.getDate()}/${
        (newDate.getMonth()+1).toString()
      }/${newDate.getFullYear()}`;
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
    this.editMode = true;
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
      controls.nightsCount.setValue(item.nightsCount);
      let nightIndex;
      for (let i = 0; i < this.nightNumberOptions.length; i++) {
        if(this.nightNumberOptions[i].nightNumber==item.nightsCount[0].nightNumber){
          nightIndex=i;
        }
      }
      this.nightNumberOptions[nightIndex].selected=true;
      let accomodationTypeIndex;
      for (let i = 0; i < this.accomodationTypeOptions.length; i++) {
        if(this.accomodationTypeOptions[i].id == item.lodgingDetailsList[0].accomodationType.id){
          accomodationTypeIndex=i;
        }
      }
      controls.accomodationType.setValue(this.accomodationTypeOptions[accomodationTypeIndex], {onlySelf: true});
      let participantIndex;
      for (let i = 0; i < this.participantOptions.length; i++) {
          if(this.participantOptions[i].id == item.lodgingDetailsList[0].participant.id){
            participantIndex=i;
          }
      }
      controls.participant.setValue(this.participantOptions[participantIndex], {onlySelf: true})
      controls.lodgersNumber.setValue(item.lodgingDetailsList[0].lodgersNumber)
      controls.unitsNumber.setValue(item.lodgingDetailsList[0].unitsNumber)
      controls.comments.setValue(item.lodgingDetailsList[0].comments)
     // controls.optionsArr.setValue(item.optionsArr)
    }
  }
   setMaxLodgersNumber(){
 
    let participant=  this.filledNightForm.get('participant').value;
    let participantId = participant.id
    let participantName= participant.name;
    switch(participantId) { 
      case 1:
       this.totalAmount= this.squadAssembleService.tripInfo.numAccompanied
       break; 
      case  2:
        this.totalAmount= this.squadAssembleService.tripInfo.numGuides
        break;
      case 3:
        this.totalAmount= this.squadAssembleService.tripInfo.numDrivers
        break;
      case 4:
        this.totalAmount= this.squadAssembleService.tripInfo.numAdultAndYoung
        break;
  }
   
    this.saveForValue= participantName;
   
}

   validateUnitsNumber(){
     this.IsUnitsNumIsValid=true;
     let unitsNumber=  this.filledNightForm.get('unitsNumber').value;
     let accomodationSelected= this.filledNightForm.get('accomodationType').value.id;
     let nightSelected = this.filledNightForm.get('nightsCount').value;
     if(unitsNumber &&  accomodationSelected || !nightSelected){
     console.log('nightSelected is: ', nightSelected)
     let avaliableSleepingOptionsByDates= this._tripService.AvailableSleepingOptionsByDay.value;
     console.log('avaliableSleepingOptionsByDates is :', avaliableSleepingOptionsByDates)
      for (let i = 0; i< nightSelected.length; i++) {

         for (let j = 0; j< avaliableSleepingOptionsByDates.length; j++) {
             let sleepingDate= avaliableSleepingOptionsByDates[j].date;
             let subDate= sleepingDate.split("T");
             subDate= subDate[0];
             let str = subDate.split("-");
             let israelFormatDate = str[2] + '/' + str[1] + '/' + str[0];
             let nightDateFormat= (nightSelected[i].date).split("/");
             if(nightDateFormat[0]<10)
             nightDateFormat[0]=0+nightDateFormat[0];
             let nightDateFormat1= nightDateFormat[0]+'/'+nightDateFormat[1]+'/'+nightDateFormat[2]
             if(israelFormatDate == nightDateFormat1)   {
              let x= avaliableSleepingOptionsByDates[j].sleepingOptions.find((q: { accomodationTypeId: any }) => q.accomodationTypeId === accomodationSelected)
              switch(accomodationSelected) { 
                case 1:          
                  if (x.availableUnits < unitsNumber){
                    this.IsUnitsNumIsValid=false;
                    this.filledNightForm.get('unitsNumber').setValue('');
                    this.displayMessage(nightSelected[i].date,x.availableUnits)                  
                  }
                       
                 break;  
                 case 2:
                  if (x.availableUnits<unitsNumber){
                    this.IsUnitsNumIsValid=false;
                    this.filledNightForm.get('unitsNumber').setValue('');
                    this.displayMessage(nightSelected[i].date,x.availableUnits)
                  
                  }
                  break;
                 case 3:
                  if (x.availableUnits<unitsNumber){
                    this.IsUnitsNumIsValid=false;
                    this.filledNightForm.get('unitsNumber').setValue('');
                    this.displayMessage(nightSelected[i].date,x.availableUnits)
                   
                  }
                  break;
                 case 4:  
                  if (x.availableUnits<unitsNumber){
                    this.IsUnitsNumIsValid=false;
                    this.filledNightForm.get('unitsNumber').setValue('');
                   this.displayMessage(nightSelected[i].date,x.availableUnits)
                  
                  }
                 break;

            }
          }     
         }
      }  
    }
     
      return  this.IsUnitsNumIsValid;
  }
    displayMessage(date, avaliableUnits){
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { message: ' סך הבקתות הפנויות בתאריך ' +date +' הינו' + avaliableUnits , content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
     
   }

  
  public sumbitUpdatedItem(): void {
    this.updateNightCount();    
    this.valuesForEdit[2] !== undefined ? this.emitFormUpdate.emit([this.filledNightForm, this.valuesForEdit[1], this.valuesForEdit[2]])
      : this.emitFormUpdate.emit([this.filledNightForm, this.valuesForEdit[1]]);
    this.editMode = false;
    this.valuesForEdit = null;
  }
  onSubmit() {
    let IsValid=this.validateUnitsNumber();
    if (!IsValid)
     return;
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
    const options = this.filterSelectedOptions();
    if(options.length !== 0){
      this.filledNightForm.controls.nightsCount.setValue(options);
    }
  }
  public filterSelectedOptions() {
    let tmpArr = this.nightNumberOptions.filter(i => i.selected);
    return tmpArr.map(i => i);
  }

  test(){
      //this.filledNightForm.get('lodgersNumber').setValue(1);
      // let obj={
      //   id: 1,
      //   name: "מלווים"
      // }
     // this.filledNightForm.get('participant').setValue(obj);
     // this.filledNightForm.controls['participant'].setValue(this.participantOptions[0], {onlySelf: true});
     this.filledNightForm.controls['nightsCount'].setValue(this.nightNumberOptions[0]);
     console.log('nightsCount selected is: ',this.filledNightForm.get('nightsCount').value);
     this.nightNumberOptions[0].selected=true;
  }
}
