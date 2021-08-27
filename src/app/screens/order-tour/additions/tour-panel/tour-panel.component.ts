import { Component, Input, OnInit } from '@angular/core';
import { TourTransportlModel } from 'src/app/utilities/models/TourTransportlModel';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() {}

  @Input() tour: TourTransportlModel;
  @Input() i: number;

  ngOnInit(): void {
  }
}
