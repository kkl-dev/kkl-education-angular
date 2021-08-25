import { Component, OnInit } from '@angular/core';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { columns, details, summery, supplier } from 'src/mock_data/additions';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {
  public title: string = 'פרטים נוספים';
  public cancelMode: boolean = true;

  public detailsColumns: TableCellModel[] = columns;

  private details: TableCellModel[] = this.formatData(details);

  private supplier: TableCellModel[] = this.formatData(supplier);

  private summery: TableCellModel[] = this.formatData(summery);

  public detailsTable = [this.details, this.supplier, this.summery];

  public columns: TableCellModel[] = [
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

  public data: TableCellModel[][] = [this.row];

  constructor() {}

  ngOnInit(): void {}

  private formatData(data: TableCellModel[]) {
    return data.map((item) => {
      return TableCellModel.create(item);
    });
  }

  public onClick() {
    this.cancelMode = !this.cancelMode;
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
