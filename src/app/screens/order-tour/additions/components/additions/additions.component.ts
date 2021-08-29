import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourTransportModel } from '../../models/tour-transport.model';

import { tourTransport } from 'src/mock_data/transport';
import { TransportModel } from '../../models/transport-model';

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
  public tour: TourTransportModel;
  public cards$: Observable<IconCardModel[]>;
  public schedule$: Observable<ScheduleModel[]>;

  public transport: TransportModel;
  public schedule: ScheduleModel;
  public addSchedule: boolean = false;

  constructor(private additionsService: AdditionsService) {}

  ngOnInit(): void {
    this.tour = TourTransportModel.create(tourTransport);
    this.cards$ = this.additionsService.navigationCards$;
    this.additionsService.emitSchedule(this.tour.schedule);
    this.schedule$ = this.additionsService.schedule$;

    this.onAdd();
  }

  public onAdd() {
    this.transport = new TransportModel();
    this.schedule = new ScheduleModel();
    this.addSchedule = true;
  }
}
