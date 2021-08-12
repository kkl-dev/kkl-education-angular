import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from './navigation-grid/navigation-grid.component';

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss']
})
export class AdditionsComponent implements OnInit {

  public navigationGrid : NavigationCardModel[]  = [
    {
      title : 'היסעים',
      svgUrl : 'bus-station'
    },
    {
      title : 'אבטחה',
      svgUrl : ''
    },
    {
      title : 'אתרים',
      svgUrl : ''
    },
    {
      title : 'כלכלה',
      svgUrl : ''
    },
    {
      title : 'אירוח',
      svgUrl : ''
    },
    {
      title : 'הפעלה מוסיקלית',
      svgUrl : ''
    },
    {
      title : 'אוהלי אירוח',
      svgUrl : ''
    },
    {
      title : 'בתי כנסת',
      svgUrl : ''
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
