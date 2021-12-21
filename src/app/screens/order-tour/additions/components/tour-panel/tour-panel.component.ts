import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { LocationModel } from '../../models/location.model';
import { ScheduleModel } from '../../models/schedule.model';
import { TransportModel } from '../../models/transport.model';
import { GeneralFormService } from '../../services/general-form.service';

@Component({
  selector: 'app-tour-panel',
  templateUrl: './tour-panel.component.html',
  styleUrls: ['./tour-panel.component.scss'],
})
export class TourPanelComponent implements OnInit {
  constructor(private squadAssembleService: SquadAssembleService,private generalFormService:GeneralFormService) { }

  @Input() editMode: boolean=true;
  //@Input() schedule: ScheduleModel;
  @Input() item: any;
  @Input() i: number;
  @Input() orderType: number;
  date;
  hidden: boolean= true;
  locations =  [new LocationModel(new Date(), new Date(), this.generalFormService.tripInfo.trip.centerField.name)]
  textHeader: any;
  ngOnInit(): void {
     //this.setDateFormat();
     
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType.currentValue !=null && changes.orderType.currentValue!= undefined) {
      console.log('changes is: ',changes.orderType.currentValue);
      this.setHeaderText(changes.orderType.currentValue);
    }
    if (changes.item != null && changes.item != undefined && (changes.orderType.currentValue === 4 || changes.orderType.currentValue === 7)) {
      this.textHeader = changes.item.currentValue.globalParameters.orderItemDetails.name;
    }
  }
   setDateFormat(){
       
        if(this.item?.globalParameters != undefined){
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
        this.textHeader= 'הזמנת היסעים'
        break;
      case 2:
        this.textHeader= 'הזמנת אבטחה'
          break;
      case 3:
        this.textHeader= 'הזמנת אתרים'
          break;
      case 4:
        this.textHeader= 'הזמנת כלכלה'
        break;
      case 6:
            this.textHeader= 'הדרכת טיול';
          break;
      case 7:
          this.textHeader= 'הזמנת אירוח ';
            break;
      case 10:
               this.textHeader= 'הפעלה מוסיקלית';
              break;
    }
  }
}
