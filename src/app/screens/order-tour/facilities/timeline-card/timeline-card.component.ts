import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline-card',
  templateUrl: './timeline-card.component.html',
  styleUrls: ['./timeline-card.component.scss']
})
export class TimelineCardComponent implements OnInit {
  @Input() item: any;
  constructor() { }

  ngOnInit(): void {
  }

}
