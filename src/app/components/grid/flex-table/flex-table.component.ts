import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableData } from 'src/app/screens/order-tour/additions/components/transport-details/transport-details.component';
import { TableCellModel } from 'src/app/utilities/models/TableCell';

@Component({
  selector: 'app-flex-table',
  templateUrl: './flex-table.component.html',
  styleUrls: ['./flex-table.component.scss']
})
export class FlexTableComponent implements OnInit {

  @Input() cols: number;

  @Input() columns: TableCellModel[] = [];
  @Input() row: TableCellModel[] = [];
  @Input() table: TableCellModel[][] = [];
  @Input() data$: Observable<TableData>;

  @Input() slots: {
    button: ElementRef;
    custom: ElementRef;
  };

  public data: TableCellModel[][] = [];
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
