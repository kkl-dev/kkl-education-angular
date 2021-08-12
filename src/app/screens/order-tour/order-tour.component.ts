import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-tour',
  templateUrl: './order-tour.component.html',
  styleUrls: ['./order-tour.component.scss']
})
export class OrderTourComponent implements OnInit {
  public activePage:number = 0;
  public nextPage:string ='education/search'
  public prevPage:string ='education/results'
  public pages:{
    svgSrc: string;
    text: string;
  }[] = [ 
 
    { 
      svgSrc: 'assets/images/trees.svg',
      text: 'הרכב קבוצה',
    },
    {
      svgSrc: 'assets/images/trees.svg',
      text: 'לינה',
    },
    {
      svgSrc: 'assets/images/gardening-tools.svg',
      text: 'מתקנים ופעילות',
    },
    {
      svgSrc: 'assets/images/trees.svg',
      text: 'תוספות',
    },
    {
      svgSrc: 'assets/images/gardening-tools.svg',
      text: 'סיכום',
    },
  ];

  changeActivePage(newActivePage:number):void {
    this.activePage = +newActivePage;
    console.log(this.activePage);
  }
  changeActivePageBottomNavigation(newActivePage:number):void {
    this.activePage = +newActivePage;
    console.log(newActivePage);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
