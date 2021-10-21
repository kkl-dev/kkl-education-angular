import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ScheduleModel } from '../../models/schedule.model';
import { TransportModel } from '../../models/transport.model';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor() { }

  @Input() editMode: boolean=true;
  @Input() schedule: ScheduleModel;
  @Input() item: any;
  @Input() i: number;
  @Input() orderType: number;

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType.currentValue !=null && changes.orderType.currentValue!= undefined) {
      console.log('changes is: ',changes.orderType.currentValue);
   }
 }
}
