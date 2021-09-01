import { Component, OnInit, Input } from '@angular/core';

export interface FlexCell {
  label: string;
  value: string;
  type?: string;
  size?: number;
  bold?: string;
  isBold?: boolean;
  classes?: string[];
}

@Component({
  selector: 'app-flex-cell',
  templateUrl: './flex-cell.component.html',
  styleUrls: ['./flex-cell.component.scss'],
})
export class FlexCellComponent implements OnInit {
  @Input() label: string;
  @Input() type: string;
  @Input() isBold?: boolean;
  @Input() value: string;
  @Input() size: number;

  public bold: number;

  constructor() {}

  ngOnInit(): void {
    this.type = this.type || 'text';
    this.bold = this.isBold ? 600 : 500;
  }
}
