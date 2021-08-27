import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Subscription, Observable } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';
import { TourTransportlModel } from 'src/app/utilities/models/TourTransportlModel';
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


  public cards$: Observable<IconCardModel[]> = this.additionsService.navigationCards$;

  public tour: TourTransportlModel =
    {
      id: 839483,
      title: 'טיול שנתי שכבת ו בי"ס תמיר',
      date: new Date(),
      locations: [{ date: new Date(), pickup: 'נס הרים', dropdown: 'בית ספר תמיר' }],
    }
    ;

  public transport: TourTransportlModel[];

  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.additionsService.emitPanallData(this.transport)
  }

  ngOnDestroy(): void {
  }


  public onPanelAdd() {
    // this.transport.push(
    //   new TourTransportlModel(new Date(), [
    //     { date: new Date(), pickup: 'הוסף מיקום', dropdown: 'הוסף מיקום' },
    //   ])
    // );

    this.additionsService.emitPanallData(this.transport)
  }
}
