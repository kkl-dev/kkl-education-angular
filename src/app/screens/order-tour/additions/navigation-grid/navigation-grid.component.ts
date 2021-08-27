import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  @Input() public title: string = "תוספות"
  @Input() public cards$: Observable<IconCardModel[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
