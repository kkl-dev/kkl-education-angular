import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-sleeping-options-by-day',
  templateUrl: './sleeping-options-by-day.component.html',
  styleUrls: ['./sleeping-options-by-day.component.scss'],
})
export class SleepingOptionsByDayComponent implements OnInit {
  currentDay: number = 0;
  @Output() emitCurrentDay: EventEmitter<number> = new EventEmitter();
  @Input() sleepingOptionsByDay: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }[];
  }[] = [];
  constructor(public tripService: TripService) {}

  ngOnInit() {
    this.tripService.forestCenter.subscribe(forestCenter => {
      //this.forestCenter = result; // this set's the username to the default observable value
      console.log('header --> forestCenter result:', forestCenter);
    });
  }

  previousPage() {
    this.currentDay = this.currentDay - 1;
    this.emitCurrentDayHandler();
  }
  nextPage() {
    this.currentDay = this.currentDay + 1;
    this.emitCurrentDayHandler();
  }

  setCurrentDay(index: number) {
    this.currentDay = index;
    this.emitCurrentDayHandler();
  }

  emitCurrentDayHandler() {
    this.emitCurrentDay.emit(this.currentDay);
  }
}
