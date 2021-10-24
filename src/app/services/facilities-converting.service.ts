import { Injectable } from '@angular/core';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {
  public days: any[] = [];
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
    },
    {
      date: "2021-10-25",
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

  public getFacilitiesDays(): void {
    this.facilities.map(item => this.days.push(item.date));
    console.log(this.days);
    this.facilities.map(item => {
      item.facilitiesList.map(facility => {
        console.log(facility);
        // const { id , name , maxOccupancy , iconPath}
      })
      
    });
  }
  public convertFacility(): void {
    // svgUrl: 'assets/images/museum.svg',
    // title: 'תאטרון',
    // maxParticipants: 'עד 320 משתתפים',
    // availability: FACILITY_OCCUPANCY,
    const facilities = [];
    // this.facilities.facilitiesList.map()
  }
}
