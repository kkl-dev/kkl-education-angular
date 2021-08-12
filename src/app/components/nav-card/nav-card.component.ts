import { Component, Input, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/screens/order-tour/additions/navigation-grid/navigation-grid.component';

@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  @Input() public item : NavigationCardModel = {}

  constructor() { }

  ngOnInit(): void {
  }

}
