import { Component, Input, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  @Input() public title : string = "" 
  @Input() public cards : NavigationCardModel[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
