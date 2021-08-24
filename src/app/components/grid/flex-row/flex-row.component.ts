import { TableCell } from './../../../utilities/models/TableCell';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flex-row',
  templateUrl: './flex-row.component.html',
  styleUrls: ['./flex-row.component.scss'],
})
export class FlexRowComponent implements OnInit {

  @Input() row: TableCell[];
  @Input() offset: number;
  @Input() cols: number = 1;

  private span: number = 8.333;
  public offsetSpan: string;
  public colsSpan: string;

  constructor() {}

  ngOnInit(): void {
    this.offsetSpan = (this.offset * this.span).toString();
    this.colsSpan = (this.cols * this.span).toString();

    console.log(this.colsSpan)
  }
}
