import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})

export class SummaryComponent implements OnInit {
  public iconSrc: string = 'assets/images/';
  public activateIndex: number[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public toogleItems(index: number) {
    if (this.activateIndex.includes(index)) {
      this.activateIndex = this.activateIndex.filter(item => item !== index);
    }
    else {
      this.activateIndex.push(index);
    }
  }
  public mySwitch(i: number): any {
    switch (i) {
      case 0:
        return this.activity;
      case 1:
        return 1;
      case 2:
        return 2;
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
  public economy: Array<object> = [
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
  public tableBodyTitles: Array<object> = [
    { name: 'אירוח/פעילות', amount: 15, price: 2610, supplierCharge: 2040, customerBilling: 360 },
    { name: 'הסעים', amount: 8, price: 2610, supplierCharge: 2040, customerBilling: 360 },
    { name: 'כלכלה', amount: 3, price: 2610, supplierCharge: 2040, customerBilling: 360 }
  ];
  public tableTitles: Array<object> = [
    { name: 'תאריך' },
    { name: 'ספק' },
    { name: 'פריט' },
    { name: 'הערות' },
    { name: 'כמות' },
    { name: 'מחיר' },
    { name: 'חיוב ספק' },
    { name: 'חיוב לקוח' },
    { icon: 'delete.svg' },
  ];
}

