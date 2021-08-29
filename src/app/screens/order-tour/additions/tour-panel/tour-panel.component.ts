import { Component, Input, OnInit } from '@angular/core';
import { TourPanelModel } from 'src/app/utilities/models/TourPanelModel';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() {}

  @Input() tour: TourPanelModel;
  @Input() i: number;

  ngOnInit(): void {
  }
}
