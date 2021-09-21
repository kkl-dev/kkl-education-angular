import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';

export interface FilledNight {
  sleepingPlace: string;
  nightsCount: string;
  saveFor: string;
  peopleCount: string;
  amount: string;
  comments: string;
  date:string | Date;
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
    this.editFilledNight.emit(filledNight);
  } 

  ngOnInit(): void {}
}
