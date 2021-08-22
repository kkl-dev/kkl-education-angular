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
  occupiedHoursArray: { totalHours: number; user: string }[] = [];
  @Input() hours: TooltipDataModel[];
  username: string = '';
  constructor(private userDataService: UserDataService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
    this.createOccupiedHoursArray();
  }

  createOccupiedHoursArray() {
    let startingHour = 0;

    this.hours.map((hour) => {
      if (startingHour < hour.startingHour) {
        this.occupiedHoursArray.push({
          totalHours: hour.startingHour - startingHour,
          user: 'none',
        });
      }

      this.occupiedHoursArray.push({
        totalHours: hour.totalTime,
        user: hour.user,
      });
      startingHour = hour.endingHour;
    });

    if (startingHour < 24) {
      this.occupiedHoursArray.push({
        totalHours: 24 - startingHour,
        user: 'none',
      });
    }
    console.log(this.occupiedHoursArray);
  }

  calculateWidth(totalHours: number): string {
    const totalHoursPrecent = (totalHours / 24) * 100;
    console.log(totalHoursPrecent);

    return `${totalHoursPrecent}%`;
  }
}
