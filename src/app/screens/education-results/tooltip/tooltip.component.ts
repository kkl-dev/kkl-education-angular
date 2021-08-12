import { Component, OnInit, Input } from '@angular/core';

export interface TooltipDataModel {
  hour: Number; avialable: boolean
}

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})


export class TooltipComponent implements OnInit {

  @Input() hours: TooltipDataModel[];
  constructor() {}

  ngOnInit(): void {

  }
}
