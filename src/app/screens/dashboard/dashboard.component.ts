import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

const THUMBUP_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.` +
  `44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5` +
  `1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
  </svg>
`;

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
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.prefix = 'education';
    this.dashboardArray = [
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

    this.iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));

  }

  ngOnInit(): void { }
}
