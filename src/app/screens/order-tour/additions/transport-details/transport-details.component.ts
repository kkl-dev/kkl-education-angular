import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { columns, details, summery, supplier } from 'src/mock_data/additions';

export interface TableData {
columns : TableCellModel[],
rows : TableCellModel[][],
}


@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {
  public title: string = 'פרטים נוספים';
  public editMode: boolean = false;

  public detailsColumns: TableCellModel[] = columns;
  public detailsTable = [details, supplier, summery];

  public detailsSubject = new BehaviorSubject<TableCellModel[][]>(
    this.detailsTable
  );
  public data$ = this.detailsSubject.asObservable();

  public cancelColumns: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'ביטול הזמנה',
    },
  ];

  private cancellationForm: TableCellModel[] = [
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

  private cancellation: TableCellModel[] = [
    {
      key: 'date',
      type: 'date',
      label: 'בוטל בתאריך',
      value : new Date()
    },
    {
      key: 'concat',
      label: 'בוטל ע"י',
      value : 'גל שרון'
    },
    {
      key: 'permission',
      label: 'אישור ביטול ע"י',
      value : 'קורנה'
    },
    {
      key: 'contactId',
      label: 'ת.ז.',
      value : 4839849344
    },
    {
      key: 'cancel',
      label: 'סיבת ביטול',
      value : 'קורנה',
      offset: 3,
    },
  ];

  public cancelTable: TableCellModel[][] = [this.cancellationForm];

  constructor() {}

  ngOnInit(): void {
    this.openCancelForm()
  }

  public openCancelForm() {
    this.detailsTable.push(this.cancellationForm);
    this.detailsSubject.next(this.detailsTable);
    this.editMode = true;
  }

  public updateCancelForm() {
    this.detailsTable[(this.detailsTable.length - 1)] = this.cancellation;
    this.detailsSubject.next(this.detailsTable);
  }
}
