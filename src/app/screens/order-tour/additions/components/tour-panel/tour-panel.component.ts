import { Component, Input, OnInit } from '@angular/core';
import { ScheduleModel } from '../../models/schedule.model';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() { }

  @Input() schedule: ScheduleModel;
  @Input() i: number;

  ngOnInit(): void {
  }
}
