import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Observable } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';
import { tourTransport } from 'src/mock_data/transport';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TourTransportModel } from './models/tour-transport.model';
import { ScheduleModel } from './models/schedule.model';

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
  public locations$: Observable<LocationModel[]>;

  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.tour = TourTransportModel.create(tourTransport);
    this.cards$ = this.additionsService.navigationCards$;
    this.additionsService.emitSchedule(this.tour.schedule)
    this.schedule$ = this.additionsService.schedule$
    this.locations$ = this.additionsService.locations$
  }

  ngOnDestroy(): void {
  }


  public onAdd() {
    // ? add schedule or locations //
    // console.log(1)
    // console.log(this.tour.locations)
    this.tour.schedule.push(new ScheduleModel())
    // console.log(this.tour.locations)
    this.additionsService.emitSchedule(this.tour.schedule)
  }
}
