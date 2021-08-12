import { AdditionsService } from './../../../services/additions.service';
import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss']
})
export class AdditionsComponent implements OnInit {

  public navigationItems: NavigationCardModel[] = [
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
    this.additionsService.setNanigationItems(this.navigationItems)
  }

  private subscribeToSubject() {
    this.additionsService.navButton$.subscribe(
      (item: NavigationCardModel) => {

        this.additionsService.setNanigationStatus(item, 'title')
      })
  }


  private findItemIndex = (itemToFind: NavigationCardModel, key: string) => {
    return this.navigationItems.find((item) => itemToFind[key] === item[key])
  }


}
