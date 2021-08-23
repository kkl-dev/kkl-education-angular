import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';
import { Subscription } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';

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

  public navigationItems: NavigationCardModel[] =
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

  public tour = [
    {
      date: new Date(),
      locations: [{ title: 'location 1' }, { title: 'location 1' }, { title: 'location 1' }],
    },
    {
      date: new Date(),
      locations: [{ title: 'location 1' }, { title: 'location 1' }],
    },
    {
      date: new Date(),
      locations: [
        { title: 'location 1' },
        { title: 'location 1' },
        { title: 'location 1' },
      ],
    },
    {
      date: new Date(),
      locations: [
        { title: 'location 1' },
        { title: 'location 1' },
        { title: 'location 1' },
      ],
    },
    {
      date: new Date(),
      locations: [
        { title: 'location 1' },
        { title: 'location 1' },
        { title: 'location 1' },
      ],
    },
  ];

  constructor(private additionsService: AdditionsService) {}

  ngOnInit(): void {
    this.subscribeToSubject();
    this.additionsService.setNavigationStatus(this.navigationItems);
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  private subscribeToSubject() {
    this.unsubscribe = this.additionsService.navButton$.subscribe(
      (item: NavigationCardModel) => {
        this.additionsService.setNanigationStatus(item, 'title');
      }
    );
  }
}
