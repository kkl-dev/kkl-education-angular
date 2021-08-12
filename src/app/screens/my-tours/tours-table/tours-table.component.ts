import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ToursTable {
  position: number;
  orderDate: string;
  projectName: string;
  destination: string;
  participantsNumber: number;
  nightsCount: number;
  departureDate: string;
  arrivalDate: string;
  characteristic: string;
  orderStatus: { precent: number; text: string };
  comments: string[];
}

const ELEMENT_DATA1: ToursTable[] = [
  {
    position: 1,
    orderDate: '01.02.2021',
    projectName: 'טיול שנתי בית ספר תמיר ראשלצ',
    destination: 'נס הרים',
    participantsNumber: 120,
    nightsCount: 2,
    departureDate: '01.04.2021 | א',
    arrivalDate: '03.04.2021 | ג',
    characteristic: 'אצי"ל',
    orderStatus: { precent: 100, text: 'מאושר' },
    comments: ['asd'],
  },
  {
    position: 2,
    orderDate: '14.01.2021',
    projectName: 'יום שלח בית ספר אופקים נתניה',
    destination: 'יער לביא',
    participantsNumber: 120,
    nightsCount: 2,
    departureDate: '01.04.2021 | א',
    arrivalDate: '03.04.2021 | ג',
    characteristic: 'אצי"ל',
    orderStatus: { precent: 10, text: 'סטטוס חדש' },

    comments: [],
  },
  {
    position: 3,
    orderDate: '08.01.2021',
    projectName: 'טיול שנתי בית ספר מקיף ח',
    destination: ' שוני',
    participantsNumber: 120,
    nightsCount: 2,
    departureDate: '01.04.2021 | א',
    arrivalDate: '03.04.2021 | ג',
    characteristic: 'פורמלי',
    orderStatus: { precent: 60, text: 'ממתין לחתימת לקוח' },
    comments: [],
  },
  {
    position: 4,
    orderDate: '14.01.2021',
    projectName: 'טיול שנתי בית ספר יסודי רתמים',
    destination: ' יער לביא',
    participantsNumber: 120,
    nightsCount: 2,
    departureDate: '01.04.2021 | א',
    arrivalDate: '03.04.2021 | ג',
    characteristic: 'פורמלי',
    orderStatus: { precent: 20, text: 'ממתין לאישור מרכז הזמנות' },
    comments: [],
  },
  {
    position: 5,
    orderDate: '08.01.2021',
    projectName: 'טיול שנתי בית ספר רעות מודיעין',
    destination: ' שוני',
    participantsNumber: 120,
    nightsCount: 2,
    departureDate: '01.04.2021 | א',
    arrivalDate: '03.04.2021 | ג',
    characteristic: 'אצי"ל',
    orderStatus: { precent: 48, text: 'ממתין לחתימת לקוח' },
    comments: [],
  },
];

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-tours-table',
  templateUrl: './tours-table.component.html',
  styleUrls: ['./tours-table.component.scss'],
})
export class ToursTableComponent {
  displayedColumns: string[] = [
    'select',
    'orderDate',
    'projectName',
    'destination',
    'participantsNumber',
    'nightsCount',
    'departureDate',
    'arrivalDate',
    'characteristic', 
    'orderStatus',
    'comments', 
  ];
  dataSource = new MatTableDataSource<ToursTable>(ELEMENT_DATA1);
  selection = new SelectionModel<ToursTable>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ToursTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  constructor() {}
}
