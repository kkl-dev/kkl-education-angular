import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from 'src/app/utilities/services/user-data.service';

export interface TooltipDataModel {
  startingHour: number;
  endingHour: number;
  totalTime: number;
  user: string;
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
    console.log('this.hours: ' + this.hours)
  }

  createOccupiedHoursArray() {
    let startingHour = 0;

    this.hours.map((hour) => {
      if (startingHour < hour.startingHour) {
        this.occupiedHoursArray.push({
          totalTime: hour.startingHour - startingHour,
          customerName: 'none',
        });
      }

      this.occupiedHoursArray.push({
        totalTime: hour.totalTime,
        customerName: hour.user,
      });
      startingHour = hour.endingHour;
    });

    if (startingHour < 24) {
      this.occupiedHoursArray.push({
        totalTime: 24 - startingHour,
        customerName: 'none',
      });
    }
  }

  calculateWidth(totalHours: number): string {
    const totalHoursPrecent = (totalHours / 24) * 100;
    return `${totalHoursPrecent}%`;
  }
}
