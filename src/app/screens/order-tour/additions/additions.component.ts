import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Observable } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';
import { tourTransport } from 'src/mock_data/transport';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TourTransportlModel } from './models/tour-transport.model';
import { SchedualeModel } from './models/schedule.model';

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

  public tour: TourTransportlModel
  public cards$: Observable<IconCardModel[]>
  public schedule$: Observable<SchedualeModel[]>;
  public locations$: Observable<LocationModel[]>;

  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.tour = TourTransportlModel.create(tourTransport);
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
    this.tour.schedule.push(new SchedualeModel())
    // console.log(this.tour.locations)
    this.additionsService.emitSchedule(this.tour.schedule)
  }
}
