import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-tour-title',
  templateUrl: './tour-title.component.html',
  styleUrls: ['./tour-title.component.scss']
})
export class TourTitleComponent implements OnInit {

  @Input() value : string
  @Input() id : string |number

  constructor() { }

  ngOnInit(): void {
  }

}
