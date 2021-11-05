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
  textHeader: any;
  ngOnInit(): void {
     this.setDateFormat();
     this.setHeaderText(this.orderType);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType.currentValue !=null && changes.orderType.currentValue!= undefined) {
      console.log('changes is: ',changes.orderType.currentValue);
    }
  }
   setDateFormat(){
    
      if(this.item.globalParameters != undefined){
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

  setHeaderText(orderType){
    switch (orderType) {
      case 1:
        this.textHeader= this.locations[0].pickupLocation ;
        break;
      case 2:
           this.textHeader= this.locations[0].pickupLocation;
          break;
      case 3:
          this.textHeader= this.locations[0].pickupLocation;
          break;
      case 4:
         this.textHeader= this.locations[0].pickupLocation;
        break;
      case 6:
            this.textHeader= 'הדרכת טיול';
          break;
      case 7:
           this.textHeader= this.locations[0].pickupLocation
            break;
      case 10:
               this.textHeader= 'הפעלה מוסיקלית';
              break;
    }
  }
}
