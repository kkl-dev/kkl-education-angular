import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from 'src/app/utilities/services/user-data.service';

export interface TooltipDataModel {
  // startingHour: number;
  // endingHour: number;
  // totalTime: number;
  // user: string;

  customerName: string;
  fromHour: any;
  tillHour: any;
  totalTime: any;
}

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  occupiedHoursArray: { totalTime: number; customerName: string }[] = [];

  @Input() hours: TooltipDataModel[];
  username: string = '';

  constructor(private userDataService: UserDataService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
    this.createOccupiedHoursArray();
  }

  createOccupiedHoursArray() {
    let fromHour = 0;

    this.hours.map((hour) => {
      try {
        hour.fromHour = this.hours[0].fromHour.split(':');
        hour.fromHour = Number(hour.fromHour[0]);
        hour.tillHour = this.hours[0].tillHour.split(':');
        hour.tillHour = Number(hour.tillHour[0]);
      } catch (error) {
        console.log(error);
      }

      if (fromHour < hour.fromHour) {
        this.occupiedHoursArray.push({
          totalTime: hour.fromHour - fromHour,
          customerName: 'none',
        });
      }

      this.occupiedHoursArray.push({
        totalTime: hour.totalTime,
        customerName: hour.customerName,
      });
      fromHour = hour.tillHour;
    });

    if (fromHour < 24) {
      this.occupiedHoursArray.push({
        totalTime: 24 - fromHour,
        customerName: 'none',
      });
    }
  }

  calculateWidth(totalHours: number): string {
    const totalHoursPrecent = (totalHours / 24) * 100;
    return `${totalHoursPrecent}%`;
  }
}