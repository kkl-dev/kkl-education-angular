import { Component, Input, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent implements OnInit {

  @Input() public item: IconCardModel;
  @Input() public prefix: string = '';
  @Input() public width: string = '150';
  @Input() public height: string = '150';

  constructor() {}

  ngOnInit(): void {}
}
