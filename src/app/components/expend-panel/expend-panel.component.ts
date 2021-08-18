import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expend-panel',
  templateUrl: './expend-panel.component.html',
  styleUrls: ['./expend-panel.component.scss'],
})
export class ExpendPanelComponent implements OnInit {
  constructor() {}

  public panelOpenState = false;

  @Input() title: string;
  @Input() subtitle: string;
  @Input() content: string;
  @Input() actins: string;

  ngOnInit(): void {}
}
