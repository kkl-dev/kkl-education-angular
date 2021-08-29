import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourTransportModel } from '../../models/tour-transport.model';

import { tourTransport } from 'src/mock_data/transport';

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

  public tour: TourTransportModel
  public cards$: Observable<IconCardModel[]>
  public schedule$: Observable<ScheduleModel[]>;
  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.tour = TourTransportModel.create(tourTransport);
    this.cards$ = this.additionsService.navigationCards$;
    this.additionsService.emitSchedule(this.tour.schedule)
    this.schedule$ = this.additionsService.schedule$

    this.onAdd()
  }


  public onAdd() {
    this.tour.schedule.unshift(new ScheduleModel())
    this.additionsService.emitSchedule(this.tour.schedule)
  }
}
