import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  constructor(private facilitiesService:FacilitiesService) { }

  ngOnInit(): void {
  }

  public onClick(): void {
    this.facilitiesService.closeModal('clear');
  }
}
