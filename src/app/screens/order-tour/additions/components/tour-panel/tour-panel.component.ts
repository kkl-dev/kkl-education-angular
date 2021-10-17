import { Component, Input, OnInit } from '@angular/core';
import { ScheduleModel } from '../../models/schedule.model';
import { TransportModel } from '../../models/transport.model';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() { }

  @Input() editMode: boolean;
  @Input() schedule: ScheduleModel;
  @Input() item: any;
  @Input() i: number;

  ngOnInit(): void {

  }
}
