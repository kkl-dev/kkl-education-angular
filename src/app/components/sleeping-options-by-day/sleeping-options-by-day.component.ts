import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-sleeping-options-by-day',
  templateUrl: './sleeping-options-by-day.component.html',
  styleUrls: ['./sleeping-options-by-day.component.scss'],
})

export class SleepingOptionsByDayComponent implements OnInit {
  @Input() currentDay: number = 0;
  @Output() emitCurrentDay: EventEmitter<number> = new EventEmitter();
  @Input() showSleepAreas:boolean=true
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
  //@Input() AvailableSleepingOptions: any;
  AvailableSleepingOptions: any;
  default: number = 0;
  //currentDay: number = 0;
  onNgInit: boolean = true;

  constructor(public tripService: TripService) { }

  ngOnInit() {

    if (!this.onNgInit) {
      this.tripService.forestCenter.subscribe(forestCenter => {
        //this.forestCenter = result; // this set's the username to the default observable value
        console.log('sleeping --> forestCenter result:', forestCenter);
      });
    }
    this.onNgInit = false;

    this.tripService.AvailableSleepingOptions.subscribe(sleepingOptions => {      
      this.AvailableSleepingOptions = sleepingOptions; // this set's the username to the default observable value
      //console.log('sleeping -- > AvailableSleepingOptions:', this.AvailableSleepingOptions);
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