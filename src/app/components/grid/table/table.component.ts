import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TableCellModel } from 'src/app/utilities/models/TableCell';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columns: TableCellModel[] = [];
  @Input() data: TableCellModel[][] = [];

  @Input() slots: {
    button: ElementRef;
    custom: ElementRef;
  };

  public cols : number
  public colsSpan : string
  public offsetSpan : string

  constructor() {}

  ngOnInit(): void {}
}
