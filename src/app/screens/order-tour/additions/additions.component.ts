import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Observable } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';
import { LocationModel, TourTransportlModel } from 'src/app/utilities/models/TourTransportlModel';
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


  public cards$: Observable<IconCardModel[]>

  public tour: TourTransportlModel

  public locations$: Observable<LocationModel[]>;

  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.cards$ = this.additionsService.navigationCards$;
    this.tour = TourTransportlModel.create(tourTransport);
    console.log(this.tour)
    // this.additionsService.emitPanallData(this.transport)
  }

  ngOnDestroy(): void {
  }


  public onPanelAdd() {
  }
}
