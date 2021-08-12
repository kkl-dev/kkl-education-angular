import { AdditionsService } from './../../../services/additions.service';
import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';
import { Subscription } from 'rxjs';

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
          svgUrl: 'football'
        },
        {
          title: 'אתרים',
          isActive: false,
          svgUrl: ''
        },
        {
          title: 'אבטחה',
          isActive: false,
          svgUrl: ''
        },
        {
          title: 'היסעים',
          isActive: true,
          svgUrl: 'bus'
        },
        {
          title: 'בתי כנסת',
          isActive: false,
          svgUrl: 'judaism'
        },
        {
          title: 'אירוח',
          isActive: false,
          svgUrl: 'climbing'
        },
        {
          title: 'הפעלה מוסיקלית',
          isActive: false,
          svgUrl: ''
        },
        {
          title: 'אוהלי אירוח',
          isActive: false,
          svgUrl: ''
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
