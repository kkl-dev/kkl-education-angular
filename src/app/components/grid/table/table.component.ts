import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { TableCellModel } from 'src/app/utilities/models/TableCell';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columns: TableCellModel[] = [];
  @Input() row: TableCellModel[] = [];
  @Input() table: TableCellModel[][] = [];

  @Input() slots: {
    button: ElementRef;
    custom: ElementRef;
  };

  public data: TableCellModel[][] = [];
  public cols: number;
  public colsSpan: string;
  public offsetSpan: string;

  constructor() {}

  ngOnInit(): void {
    this.data.map((row) => {});
  }

  private formatData(data: TableCellModel[]) {
    return data.map((item) => {
      return TableCellModel.create(item);
    });
  }
}
