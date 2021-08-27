import { SchedualeModel } from './../../../../utilities/models/ScheduleModel';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() { }

  @Input() schedule: SchedualeModel;
  @Input() i: number;

  ngOnInit(): void {
  }
}
