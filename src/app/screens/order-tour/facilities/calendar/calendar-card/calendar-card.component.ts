import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {
  @Input() svgUrl:string ;
  constructor() { }

  ngOnInit(): void {
    console.log(this.svgUrl);
    
  }

}
