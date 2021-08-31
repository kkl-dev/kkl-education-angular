import { Component, OnInit, Input } from '@angular/core';

export interface FlexCell {
  label: string;
  value: string;
  type?: string;
  divider?: boolean;
}

@Component({
  selector: 'app-flex-cell',
  templateUrl: './flex-cell.component.html',
  styleUrls: ['./flex-cell.component.scss'],
})
export class FlexCellComponent implements OnInit {
  @Input() label: string;
  @Input() type: string;
  @Input() value: string;
  @Input() divider: boolean;

  constructor() {
    this.type = this.type || 'text';
  }

  ngOnInit(): void {}
}
