import { Component, Input, OnInit } from '@angular/core';

export interface NavigationCardModel {
  svgUrl? : string,
  title? : string,
  onNext? : Function,
  onPrev? : Function
  active ?  : boolean
}

@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  @Input() public title : string = ""
  @Input() public navigationGrid : NavigationCardModel[] = []

  constructor() { }

  ngOnInit(): void {

    console.log(this.navigationGrid)
  }

}
