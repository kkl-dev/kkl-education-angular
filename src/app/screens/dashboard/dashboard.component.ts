import { Component, Input } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public activeRoute: string = '';

  public cards: NavigationCardModel[] = [];

  public prefix: string = 'education';
  @Input() public width: string = '150';
  @Input() public height: string = '150';

  constructor() {
    this.cards = [
      {
        svgUrl: 'destination',
        title: 'הטיולים שלי',
        path: 'search',
      },
      {
        svgUrl: 'button',
        title: 'טיול חדש',
        path: 'search',
      },
      {
        svgUrl: 'report',
        title: 'דוחות',
        path: 'search',
      },
    ];
  }
}
