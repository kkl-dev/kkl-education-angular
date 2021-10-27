import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {
  @Input() public props:any;
  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    console.log(this.props);
  }

}
