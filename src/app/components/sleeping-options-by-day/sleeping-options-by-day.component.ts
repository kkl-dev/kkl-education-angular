import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sleeping-options-by-day',
  templateUrl: './sleeping-options-by-day.component.html',
  styleUrls: ['./sleeping-options-by-day.component.scss'],
})
export class SleepingOptionsByDayComponent implements OnInit {
  currentDay: number = 0;

  @Input() sleepingOptionsByDay: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }[];
  }[]=[];
  constructor() {
    console.log('construtc');
  }

  previousPage() {
    console.log('asdasdsd');
    this.currentDay = this.currentDay - 1;
    console.log(this.currentDay);
  }
  nextPage() {
    console.log('next');
    this.currentDay = this.currentDay + 1;
    console.log(this.currentDay);
  }

  setCurrentDay(index:number){
this.currentDay=index
  }

  ngOnInit(): void {
    console.log(this.sleepingOptionsByDay);
  }

}
