import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);
  clicked: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  public onClick(): void {
    this.clicked = !this.clicked;
    this.close.emit(this.clicked);
  }
}
