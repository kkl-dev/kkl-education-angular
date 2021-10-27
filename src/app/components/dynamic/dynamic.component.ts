import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})
export class DynamicComponent implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

}
