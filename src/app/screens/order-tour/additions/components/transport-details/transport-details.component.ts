import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { columns, details, summery, supplier } from 'src/mock_data/additions';

export interface TableData {
  columns?: TableCellModel[];
  rows: TableCellModel[][];
}

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {

  @Input() columns: TableCellModel[] = [];


  public title: string = 'פרטים נוספים';
  public editMode: boolean = false;
  public rows: TableCellModel[][] = [details, supplier, summery];

  public detailsSubject = new BehaviorSubject<TableData>({
    columns: this.columns,
    rows: this.rows,
  });

  public data$ = this.detailsSubject.asObservable();

  public cancellation: string = '';

  private cancelColumn: TableCellModel = {
    key: 'cancel',
    label: 'ביטול הזמנה',
  };

  private cancellationForm: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'סיבת ביטול',
      type: 'custom',
      cols: 2,
    },
    {
      key: 'button',
      type: 'button',
      label: '',
      cols: 2,
    },
  ];

  private cancellationRow: TableCellModel[] = [
    {
      key: 'date',
      type: 'date',
      label: 'בוטל בתאריך',
      value: new Date(),
    },
    {
      key: 'concat',
      label: 'בוטל ע"י',
      value: 'גל שרון',
    },
    {
      key: 'permission',
      label: 'אישור ביטול ע"י',
      value: 'קורנה',
    },
    {
      key: 'contactId',
      label: 'ת.ז.',
      value: 4839849344,
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public openCancelForm() {
    this.rows.push(this.cancellationForm);
    this.columns.push(this.cancelColumn);
    this.detailsSubject.next({ columns: this.columns, rows: this.rows });
    this.editMode = true;
  }

  public updateCancelForm() {

    const cancellation: TableCellModel = {
      key: 'cancel',
      label: 'סיבת ביטול',
      value: this.cancellation,
      cols: 3,
    };

    this.cancellationRow.push(cancellation)
    this.rows[this.rows.length - 1] = this.cancellationRow;
    this.detailsSubject.next({ columns: this.columns, rows: this.rows });
  }
}
