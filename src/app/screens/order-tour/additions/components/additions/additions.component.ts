import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourModel } from '../../models/tour.model';

import { tourTransport } from 'src/mock_data/transport';
import { TourService } from '../../services/tour.service';

export interface TourDayModel {
  date: Date;
  locations: any[];
}

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss'],
})
export class AdditionsComponent implements OnInit {
  public tour: TourModel;
  public schedule$: Observable<ScheduleModel[]>;

  public schedule: ScheduleModel;
  public addSchedule: boolean = false;

  constructor(
    private tourService: TourService,
    private additionsService: AdditionsService
  ) {}

  ngOnInit(): void {

    this.tourService.setTour(TourModel.create(tourTransport));
    this.tour = this.tourService.getTour();

    this.additionsService.emitSchedule(this.tour.schedule);
    this.schedule$ = this.additionsService.schedule$;

    this.onAdd();
  }

  public onAdd() {
    this.schedule = new ScheduleModel();
    this.addSchedule = true;
  }
}
