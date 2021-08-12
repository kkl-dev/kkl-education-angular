import { AdditionsService } from './../../../services/additions.service';
import { Component, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss']
})
export class AdditionsComponent implements OnInit {

  public navigationItems : NavigationCardModel[]  = [
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

  constructor(
    private additionsService : AdditionsService
  ) { }

  ngOnInit(): void {
    this.additionsService.setNanigationItems(this.navigationItems)
  }

  private subscribeToSubject() {
    this.additionsService.navButton$.subscribe(
      (item : NavigationCardModel) => {
        
      })
  }


  private findItemIndex = (itemToFind : NavigationCardModel, key : string) => {
    return this.navigationItems.find((item)=> itemToFind[key] === item[key])
  }

  public onCardClick = (itemToUpdate : NavigationCardModel) => {
    itemToUpdate.active = !itemToUpdate.active
  }


}
