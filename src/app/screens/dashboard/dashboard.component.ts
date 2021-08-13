import { map } from 'rxjs/operators';
import { IconsService } from './../../utilities/icons/icons.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  public activeRoute: string = '';
  public dashboardArray: {
    svgUrl: string
    name: string
    url: string
  }[] = [];
  public prefix: string = '';


  constructor(
    private iconsService: IconsService
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
        svgUrl: 'assets/images/report.svg',
        name: 'דוחות',
        url: 'search',
      },
    ]
  }

  ngOnInit(): void {
    this.iconsService.setIconsList(this.dashboardArray)
  }
}
