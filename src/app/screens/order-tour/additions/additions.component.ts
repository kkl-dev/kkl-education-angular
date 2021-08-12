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
      title : 'כלכלה',
      svgUrl : 'football'
    },
    {
      title : 'אתרים',
      svgUrl : ''
    },
    {
      title : 'אבטחה',
      svgUrl : ''
    },
    {
      title : 'היסעים',
      svgUrl : 'bus'
    },
    {
      title : 'בתי כנסת',
      svgUrl : 'judaism'
    },
    {
      title : 'אירוח',
      svgUrl : 'climbing'
    },
    {
      title : 'הפעלה מוסיקלית',
      svgUrl : ''
    },
    {
      title : 'אוהלי אירוח',
      svgUrl : ''
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
