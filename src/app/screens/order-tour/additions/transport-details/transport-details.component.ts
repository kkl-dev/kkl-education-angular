import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { columns, details, summery, supplier } from 'src/mock_data/additions';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {
  public title: string = 'פרטים נוספים';
  public cancelMode: boolean = false;

  public detailsColumns: TableCellModel[] = columns;
  public detailsTable = [details, supplier, summery];

  public detailsSubject = new BehaviorSubject<TableCellModel[][]>(this.detailsTable);
  public data$ = this.detailsSubject.asObservable()

  public cancelColumns: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'ביטול הזמנה',
    },
  ];

  private row: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'סיבת ביטול',
      type: 'custom',
      offset: 3,
    },
    {
      key: 'button',
      type: 'button',
      label: '',
      offset: 3,
    },
  ];

  public cancelTable: TableCellModel[][] = [this.row];

  constructor() {}

  ngOnInit(): void {}

  public onClick() {
    if (this.cancelMode) {
      console.log('push');
    }

    this.detailsTable.push(summery);
    this.detailsSubject.next(this.detailsTable)
    // this.cancelMode = !this.cancelMode;
  }

  private updateCancelDetails() {
    const cancel = {
      key: 'cancel',
      label: '',
      offset: 3,
    };

    this.row.push(cancel);
  }
}
