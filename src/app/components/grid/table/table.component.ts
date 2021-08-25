import { TableData } from './../../../screens/order-tour/additions/transport-details/transport-details.component';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  @Input() data$: Observable<TableData>;

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
    this.subscribeToData();
  }

  private subscribeToData() {
    this.data$
      .pipe(
        map((data: TableData) => {
          data.rows = data.rows.map((row) => this.formatData(row));
          return data
        })
      )
      .subscribe((data: TableData) => {
        this.data = data.rows;
        this.columns = data.columns
      });
  }

  private formatData(data: TableCellModel[]) {
    return data.map((item) => {
      return TableCellModel.create(item);
    });
  }
}
