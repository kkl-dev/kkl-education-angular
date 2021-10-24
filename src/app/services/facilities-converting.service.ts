import { Injectable } from '@angular/core';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {
  public facilities: FacilityModel[] = [
    {
      date: "2021-10-24",
      facilitiesList: [
        {
          id: 8,
          name: 'כיתה גדולה',
          maxOccupancy: 40,
          iconPath: 'assets/images/museum.svg',
          occupiedHours: [
            {
              fromHour: '13:00',
              tillHour: '15:00',
              totalTime: 1.25,
              customerName: 'סימינר הקיבוצים'
            }
          ]
        }
      ]
    }
  ];

  constructor() { }

  private getFacilitiesDays(): void {
    this.facilities.map(item => {
      console.log(item);
      
    });
  }

}
