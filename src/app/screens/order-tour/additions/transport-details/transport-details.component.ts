import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transport-details',
  templateUrl: './transport-details.component.html',
  styleUrls: ['./transport-details.component.scss']
})
export class TransportDetailsComponent implements OnInit {

  public title : string = 'פרטים נוספים'

  constructor() { }

  ngOnInit(): void {
  }

}
