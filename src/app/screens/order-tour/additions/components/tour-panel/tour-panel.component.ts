import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { LocationModel } from '../../models/location.model';
import { ScheduleModel } from '../../models/schedule.model';
import { TransportModel } from '../../models/transport.model';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor(private squadAssembleService: SquadAssembleService) { }

  @Input() editMode: boolean=true;
  //@Input() schedule: ScheduleModel;
  @Input() item: any;
  @Input() i: number;
  @Input() orderType: number;
  locations =  [new LocationModel(new Date(), new Date(), this.squadAssembleService.tripInfofromService.trip.centerField.name)]
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType.currentValue !=null && changes.orderType.currentValue!= undefined) {
      console.log('changes is: ',changes.orderType.currentValue);
   }
 }
}
