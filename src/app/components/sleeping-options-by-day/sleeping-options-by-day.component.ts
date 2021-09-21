import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sleeping-options-by-day',
  templateUrl: './sleeping-options-by-day.component.html',
  styleUrls: ['./sleeping-options-by-day.component.scss'],
})
export class SleepingOptionsByDayComponent implements OnInit {
  currentDay: number = 0;
  @Output() emitCurrentDay: EventEmitter<number> = new EventEmitter();
  @Output() currentDate: EventEmitter<any> = new EventEmitter();
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
  constructor() {}

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

  ngOnInit(): void {}

  emitCurrentDayHandler() {
    this.currentDate.emit(this.sleepingOptionsByDay[this.currentDay]);
    this.emitCurrentDay.emit(this.currentDay);
  }
}
