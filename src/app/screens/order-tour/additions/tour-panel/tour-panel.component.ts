import { Component, Input, OnInit } from '@angular/core';
import { TourDayModel } from '../additions.component';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() {}

  @Input() tourDay: TourDayModel;

  public items: [
    {
      title: 'dsjkdjskdjs';
    },
    {
      title: 'dsjkdjskdjs';
    },
    {
      title: 'dsjkdjskdjs';
    }
  ];

  ngOnInit(): void {}
}
