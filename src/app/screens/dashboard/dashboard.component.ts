import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public activeRoute: string = '';
  public dashboardArray:{
    svgUrl: string
    name: string
    url: string
  }[] = [];
  public prefix: string = '';


  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService
  ) {
    this.prefix = 'education';
    this.dashboardArray =[
      {
        svgUrl: 'assets/images/05-destination.svg',
        name: 'הטיולים שלי',
        url: 'search',
      },
      {
        svgUrl: 'assets/images/button.svg',
        name: 'טיול חדש',
        url: 'search',
      },
      { 
        svgUrl: 'assets/images/report.svg',
        name: 'הטיולים שלי',
        url: 'search',
      },
    ]
 
  }

  ngOnInit(): void {}
}
