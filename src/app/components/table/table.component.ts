import { Component, OnInit } from '@angular/core';

interface PeriodicElement {
  customerBilling: number,
  supplierCharge: number,
  confirmation: string,
  status: string,
  item: string,
  supplier: string,
  amount: number
}
const ELEMENT_DATA: PeriodicElement[] = [
  { customerBilling: 20, supplierCharge: 30, amount: 50, confirmation: 'confirmation', status: 'status', item: 'item', supplier: 'supplier' }
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public displayedColumns: string[] = ['delete', 'customerBilling', 'supplierCharge', 'confirmation', 'status', 'amount', 'item', 'supplier'];
  public dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
