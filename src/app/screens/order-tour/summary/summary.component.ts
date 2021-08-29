import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})

export class SummaryComponent implements OnInit {
  public activateIndex: number[] = [];
  public examplePrice: number = 1000;
  constructor() { }

  ngOnInit(): void {
  }
  // open / close table
  public toggleItems(index: number) {
    if (this.activateIndex.includes(index)) {
      this.activateIndex = this.activateIndex.filter(item => item !== index);
    } else {
      this.activateIndex.push(index);
    }
  }
  // open / close all tables
  public toggleAllItems() {
    if (this.activateIndex.length !== this.tableBodyTitles.length) {
      for (let i = 0; i < this.tableBodyTitles.length; i++) {
        if (!this.activateIndex.includes(i)) {
          this.activateIndex.push(i);
        }
      }
    } else {
      this.activateIndex.length = 0;
    }
  }

  public mySwitch(n: number): any {
    switch (n) {
      case 0:
        return this.activity;
      case 1:
        return this.transportation;
      case 2:
        return this.economy;
    }
  }
  public activity: Array<object> = [
    {
      date: '15.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
      amount: 15, price: 870, supplierCharge: 680, customerBilling: 120
    },
    {
      date: '16.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
      amount: 15, price: 870, supplierCharge: 680, customerBilling: 120
    },
    {
      date: '17.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
      amount: 15, price: 870, supplierCharge: 680, customerBilling: 120
    }
  ];
  public transportation: Array<object> = [
    {
      date: '15.06.21', supplier: 'ספקים שונים', item: 'אוטובוס - יום מלא', comments: 'בית ספר תמיר - נס הרים',
      amount: 2, supplierCharge: 0, customerBilling: 7818
    },
    {
      date: '16.06.21', supplier: 'נס הרים', item: 'ניווט ביער -נס הרים', comments: 'לקוח מזמין',
      amount: 15, price: 870, supplierCharge: 680, customerBilling: 120
    }
  ];
  public economy: Array<object> = [
    {
      date: '15.06.21', supplier: 'שבולת בע"מ', item: 'ארוח בוקר בהגשה', comments: '',
      amount: 15, price: 870, supplierCharge: 680, customerBilling: 120
    },
    {
      date: '16.06.21', supplier: 'שבולת בע"מ', item: '150', comments: 'לקוח מזמין',
      amount: 150, price: 0, supplierCharge: 135, customerBilling: 1218
    }
  ];
  public tableBodyTitles: Array<object> = [
    { name: 'אירוח/פעילות', amount: 15, price: 2610, supplierCharge: 2040, customerBilling: 360 },
    { name: 'הסעים', amount: 8, price: 2610, supplierCharge: 2040, customerBilling: 360 },
    { name: 'כלכלה', amount: 3, price: 2610, supplierCharge: 2040, customerBilling: 360 }
  ];
  public tableTitles: Array<object> = [
    { name: 'תאריך' ,colspan : 1},
    { name: 'ספק' ,colspan : 1},
    { name: 'פריט' ,colspan : 3},
    { name: 'הערות' ,colspan : 1},
    { name: 'כמות' ,colspan : 1},
    { name: 'מחיר' ,colspan : 1},
    { name: 'חיוב ספק' ,colspan : 1},
    { name: 'חיוב לקוח' ,colspan : 1},
    { icon: 'delete.svg' ,colspan : 1},
  ];
}

