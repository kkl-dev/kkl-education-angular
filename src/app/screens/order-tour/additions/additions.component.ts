import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Subscription, Observable } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';
import { TourPanelModel } from 'src/app/utilities/models/TourPanelModel';
import { transportData } from 'src/mock_data/transport';

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

  // private unsubscribe: Subscription =

  public cards$: Observable<IconCardModel[]> = this.additionsService.navigationCards$;

  public title: string = 'תוספות';
  public tourTitle: string = 'טיול שנתי שכבת ו בי"ס תמיר';

  public id: number = 839483;

  public tour = [
    {
      date: new Date(),
      locations: [{ title: 'בית ספר תמיר - נס הרים' }],
    },
  ];

  public transport: TourPanelModel[];

  constructor(private additionsService: AdditionsService) { }

  ngOnInit(): void {
    this.subscribeToSubject();
    this.transport = transportData.map((item: TourPanelModel) => {
      return TourPanelModel.create(item);
    });

    this.additionsService.emitPanallData(this.transport)
  }

  ngOnDestroy(): void {
    // this.unsubscribe.unsubscribe();
  }

  private subscribeToSubject() {
    this.additionsService.navButton$.subscribe(
      (item: IconCardModel) => {
        this.additionsService.setNanigationStatus(item, 'title');
      }
    );
  }

  public onPanelAdd() {
    this.transport.push(
      new TourPanelModel(new Date(), [
        { date: new Date(), pickup: 'הוסף מיקום', dropdown: 'הוסף מיקום' },
      ])
    );

    this.additionsService.emitPanallData(this.transport)
  }
}
