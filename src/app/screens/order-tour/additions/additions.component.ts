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
      active : false,
      svgUrl : 'football'
    },
    {
      title : 'אתרים',
      active : false,
      svgUrl : ''
    },
    {
      title : 'אבטחה',
      active : false,
      svgUrl : ''
    },
    {
      title : 'היסעים',
      active : true,
      svgUrl : 'bus'
    },
    {
      title : 'בתי כנסת',
      active : false,
      svgUrl : 'judaism'
    },
    {
      title : 'אירוח',
      active : false,
      svgUrl : 'climbing'
    },
    {
      title : 'הפעלה מוסיקלית',
      active : false,
      svgUrl : ''
    },
    {
      title : 'אוהלי אירוח',
      active : false,
      svgUrl : ''
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  private findItemIndex = (itemToFind : NavigationCardModel, key : string) => {
    return this.navigationGrid.find((item)=> itemToFind[key] === item[key])
  }

  public onCardClick = (itemToUpdate : NavigationCardModel) => {
    itemToUpdate.active = !itemToUpdate.active
  }


}
