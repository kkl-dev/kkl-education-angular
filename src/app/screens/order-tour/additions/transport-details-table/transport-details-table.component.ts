import { Component, OnInit } from '@angular/core';

export interface TableCell {
  key?: string;
  label: string;
  value?: string;
  offset?: number;
  cols?: number;
  divider?: boolean;
}

export interface HeaderRoW {
  additionType: string;
  status: string;
  purchaseId: string;
}

export interface supplierRoW {
  tourId: string;
  additionType: string;
  status: string;
  purchaseId: string;
}

@Component({
  selector: 'app-transport-details-table',
  templateUrl: './transport-details-table.component.html',
  styleUrls: ['./transport-details-table.component.scss'],
})
export class TransportDetailsTableComponent implements OnInit {
  public col: number = 10;

  private headerRow: HeaderRoW = {
    additionType: 'היסעים',
    status: 'חדש',
    purchaseId: 'חדש',
  };

  public columns: TableCell[] = [
    {
      key: 'tourId',
      label: 'מספר טיול',
      value: '213232',
    },
    {
      label: 'ספק',
    },
    {
      label: 'קליטת טיול',
    },
  ];

  private details = [
    {
      key: 'type',
      label: 'סוג',
    },
    {
      key: 'status',
      label: 'סטטוס',
    },
    {
      key: 'type',
      label: 'מספר הזמנת רכש',
    },
  ];

  public data = [
    { row: this.details },
    { row: this.details },
    { row: this.details },
  ];

  constructor() {}

  ngOnInit(): void {}
}
