import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flex-cell',
  templateUrl: './flex-cell.component.html',
  styleUrls: ['./flex-cell.component.scss']
})
export class FlexCellComponent implements OnInit {

  @Input() public label :string
  @Input() public type :string
  @Input() public value :string

  constructor() { }

  ngOnInit(): void {

    console.log(this.type)
    console.log(this.value)
  }

}
