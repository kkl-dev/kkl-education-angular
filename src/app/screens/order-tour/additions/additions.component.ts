import { Component, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Subscription } from 'rxjs';
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

  private unsubscribe: Subscription =
    this.additionsService.navButton$.subscribe();

  public cards: IconCardModel[] =
    this.additionsService.getNavigationItems().length > 0
      ? this.additionsService.getNavigationItems()
      : [
        {
          title: 'הפעלה מוסיקלית',
          isActive: false,
          svgUrl: 'music',
        },
        {
          title: 'הדרכה',
          isActive: false,
          svgUrl: 'guide',
        },
        {
          title: 'אירוח',
          isActive: false,
          svgUrl: 'tent',
        },
        {
          title: 'כלכלה',
          isActive: false,
          svgUrl: 'dinner',
        },
        {
          title: 'אתרים',
          isActive: false,
          svgUrl: 'site',
        },
        {
          title: 'אבטחה',
          isActive: false,
          svgUrl: 'shield',
        },

        {
          title: 'היסעים',
          isActive: true,
          svgUrl: 'bus',
          badgeValue: 3,
        },
      ];

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
    this.additionsService.setNavigationStatus(this.cards);
    this.transport = transportData.map((item: TourPanelModel) => {
      return TourPanelModel.create(item);
    });

    this.additionsService.emitPanallData(this.transport)
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  private subscribeToSubject() {
    this.unsubscribe = this.additionsService.navButton$.subscribe(
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
