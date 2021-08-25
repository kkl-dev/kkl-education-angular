import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss'],
})
export class TransportDetailsComponent implements OnInit {
  public title: string = 'פרטים נוספים';
  public cancelMode: boolean = false;



  // public columns: TableCellModel[] = [
  //   {
  //     key: 'tourId',
  //     label: 'סיבנת ביטול',
  //     value: '213232',
  //   },
  // ];

  public onCLick() {}
  constructor() {}

  ngOnInit(): void {}
}
