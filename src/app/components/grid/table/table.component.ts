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
  @Input() data$: Observable<TableCellModel[][]>;

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
        map((data: TableCellModel[][]) => {
          return data.map((row) => this.formatData(row));
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
  }

  private formatData(data: TableCellModel[]) {
    return data.map((item) => {
      return TableCellModel.create(item);
    });
  }
}
