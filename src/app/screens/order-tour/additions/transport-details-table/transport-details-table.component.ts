import { Component, OnInit } from '@angular/core';

export interface TableCell {
  key?: string;
  type?: string;
  label: string;
  value?: string | Date | number;
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

  private details: TableCell[] = [
    {
      key: 'type',
      label: 'סוג',
      value: 'היסעים',
    },
    {
      key: 'status',
      label: 'סטטוס',
      value: 'חדש',
    },
    {
      key: 'type',
      label: 'מספר הזמנת רכש',
      value: 'חדש',
      divider : true
    },
  ];

  private suplier: TableCell[] = [
    {
      key: 'name',
      label: 'שם הספק הנבחר',
      value: 'יפעת הסעות בע"מ',
    },
    {
      key: 'businessId',
      label: 'ע.מורשה',
      value: 5500,
    },
    {
      key: 'financelId',
      label: 'מ.ספק הפיננסית',
      type: 'number',
      value: 39203923,
    },
    {
      key: 'address',
      label: 'כתובת',
      value: 'רחובות',
    },
    {
      key: 'contact',
      label: 'איש קשר',
      value: 'שחר גל',
    },
    {
      key: 'phone',
      label: 'טלפון',
      value: '04-43894389',
    },
    {
      key: 'fax',
      label: 'פקס',
      value: '04-43894389',
    },
    {
      key: 'email',
      label: 'מייל',
      value: 'dsds@ewew.com',
    },
    {
      key: 'processId',
      label: 'איש קשר',
      value: 'שחר גל',
    },
    {
      key: 'aproveContact',
      label: 'השמנה אושרה ע"י',
      value: '323237823',
    },
    {
      key: 'aproveDate',
      label: 'תאריך אישור',
      type: 'date',
      value: new Date(),
    },
    {
      key: 'aproveContactId',
      label: 'ת.ז מאשר',
      value: '382938293',
      divider : true
    },
  ]

  public data = [
    this.details,
    this.suplier,
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
