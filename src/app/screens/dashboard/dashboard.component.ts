import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent {
  public activeRoute: string = '';
  public dashboardArray: {
    svgUrl: string
    name: string
    url: string
  }[] = [];
  public prefix: string = '';


  constructor(
  ) {
    this.prefix = 'education';
    this.dashboardArray = [
      {
        svgUrl: 'destination',
        name: 'הטיולים שלי',
        url: 'search',
      },
      {
        svgUrl: 'button',
        name: 'טיול חדש',
        url: 'search',
      },
      {
        svgUrl: 'report',
        name: 'דוחות',
        url: 'search',
      },
    ]
  }

}
