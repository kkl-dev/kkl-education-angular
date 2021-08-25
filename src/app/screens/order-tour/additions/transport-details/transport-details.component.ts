import { Component, OnInit } from '@angular/core';
import { TableCellModel } from 'src/app/utilities/models/TableCell';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {

  public title: string = 'פרטים נוספים';
  public cancelMode: boolean = true;

  public columns: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'ביטול הזמנה',
    },
  ];

  private row : TableCellModel[] = [
    {
      key: 'cancel',
      label: 'סיבת ביטול',
      type : 'custom',
      offset : 3
    },
    {
      key: 'button',
      type: 'button',
      label: '',
      offset : 3
    },
  ]

  public data: TableCellModel[][] = [
    this.row
  ];

  constructor() {}

  ngOnInit(): void {}

  public onClick() {
    this.cancelMode = !this.cancelMode
  }
}
