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
  date;
  locations =  [new LocationModel(new Date(), new Date(), this.squadAssembleService.tripInfofromService.trip.centerField.name)]
  ngOnInit(): void {
     this.setDateFormat()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType.currentValue !=null && changes.orderType.currentValue!= undefined) {
      console.log('changes is: ',changes.orderType.currentValue);
    }
  }
   setDateFormat(){
     if(this.item.globalParameters.startDate.includes('T')){
       let subDate= this.item.globalParameters.startDate.split('T');
       let date= subDate[0];
       let subDate1= date.split('-');
       let israelDateFormat= subDate1[2]+'/'+subDate1[1]+'/'+subDate1[0];
       this.date= israelDateFormat;
     }
     else{
      this.date= this.item.globalParameters.startDate;
     }
  }
}
