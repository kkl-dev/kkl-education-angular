import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';
import { Subscription } from 'rxjs';
import { AdditionsService } from '../../../utilities/services/additions.service';

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss']
})
export class AdditionsComponent implements OnInit {

  private unsubscribe: Subscription = this.additionsService.navButton$.subscribe()

  public navigationItems: NavigationCardModel[] =
    this.additionsService.getNavigationItems().length > 0 ?
      this.additionsService.getNavigationItems() :
      [
        {
          title: 'כלכלה',
          isActive: false,
          svgUrl: 'dinner'
        },
        {
          title: 'אתרים',
          isActive: false,
          svgUrl: 'site'
        },
        {
          title: 'אבטחה',
          isActive: true,
          svgUrl: 'shield'
        },
        {
          title: 'אירוח',
          isActive: false,
          svgUrl: 'tent'
        },
        {
          title: 'הפעלה מוסיקלית',
          isActive: false,
          svgUrl: 'music'
        },
        {
          title: 'הדרכה',
          isActive: false,
          svgUrl: 'guide'
        },
        {
          title: 'היסעים',
          isActive: false,
          svgUrl: 'bus'
        },
      ]

  constructor(
    private additionsService: AdditionsService
  ) { }

  ngOnInit(): void {
    this.subscribeToSubject()
    this.additionsService.setNavigationStatus(this.navigationItems)
  }

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe()
  }

  private subscribeToSubject() {
    this.unsubscribe = this.additionsService.navButton$.subscribe(
      (item: NavigationCardModel) => {
        this.additionsService.setNanigationStatus(item, 'title')
      })
  }

}
