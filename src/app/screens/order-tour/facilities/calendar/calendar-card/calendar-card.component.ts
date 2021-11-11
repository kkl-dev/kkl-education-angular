import { Component, Input, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss'],
})

export class CalendarCardComponent implements OnInit {
  constructor() { }

  @Input() public props!: any;
  public checkHour: boolean;

  ngOnInit(): void {
    this.checkTimes();
  }

  private checkTimes(): void {
    const split = this.props.timeText.split(' - ');
   // let hours = split.map(item => {
      const hours = split.map(item => {

      return item.split(':');
    });

    try {
      const compareHour = +hours[0][0] == +hours[1][0];
      const compareHalfHour = +hours[0][0] + 1 == +hours[1][0];
          
      if (compareHour) {
        this.checkHour = true;
      }
  
      if (!compareHour && compareHalfHour) {
        const totalMinutes = this.compareMinutes(hours);
        if (totalMinutes < 60) {
          this.checkHour = true;
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

  private compareMinutes(hours: any[]): number {
    const startMinutes = +hours[0][1];
    const endMinutes = +hours[1][1];
    return Math.abs(startMinutes - 60) + endMinutes;
  }
}
