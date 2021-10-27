import { Component, Input, NgModule, OnInit } from '@angular/core';


@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss'],
})

export class CalendarCardComponent implements OnInit {
  constructor() { }

  @Input() public props!: any;

  ngOnInit(): void {
  }


}
