import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';


      //  accomodationTypeId: new FormControl(null, [Validators.required]),
      // accomodationTypeName: new FormControl(null, [Validators.required]),
      // date: new FormControl(null, [Validators.required]),
      // participantId: new FormControl(null, [Validators.required]),
      // participantName: new FormControl(null, [Validators.required]),
      // lodgersNumber: new FormControl(null, [Validators.required]),
      // unitsNumber: new FormControl(null, [Validators.required]),
      //  comments: new FormControl(null, [Validators.required]),

export interface FilledNight {
  accomodationTypeId: number;
  accomodationTypeName: string;
  date: string;
  participantName: string;
  participantId: number;
  lodgersNumber: number;
  unitsNumber: number;
  comments: string;
}
@Component({
  selector: 'app-filled-night',
  templateUrl: './filled-night.component.html',
  styleUrls: ['./filled-night.component.scss'],
})
export class FilledNightComponent implements OnInit {
  @Input() filledNight!: FilledNight;
  @Input() index: number;
  @Output() deleteFilledNight: EventEmitter<void> = new EventEmitter();
  @Output() editFilledNight: EventEmitter<FilledNight> = new EventEmitter();

  constructor(private sleepingService:SleepingServiceService) {
  } 

  emitDeleteFilledNight(): void {
    this.deleteFilledNight.emit();
  }

  emitEditFilledNight(filledNight: FilledNight): void {
    console.log(filledNight);
     
    this.editFilledNight.emit(filledNight);
  } 

  ngOnInit(): void {}
}
