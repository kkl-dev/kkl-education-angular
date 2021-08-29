import { Component, Input, OnInit } from '@angular/core';
import { SchedualeModel } from '../models/ScheduleModel';

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
