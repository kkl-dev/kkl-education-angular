import { Component, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { columns, details, summery, supplier } from 'src/mock_data/additions';

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

  public columns: TableCellModel[] = columns;

  private details: TableCellModel[] = this.formatData(details);

  private supplier: TableCellModel[] = this.formatData(supplier)

  private summery: TableCellModel[] = this.formatData(summery)

  public data = [this.details, this.supplier, this.summery];


  constructor() {}

  ngOnInit(): void {
  }

  private formatData(data: TableCellModel[]) {
    return data.map((item) => {
      return TableCellModel.create(item);
    });
  }
}
