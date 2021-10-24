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
            },
            {
              fromHour: '18:00',
              tillHour: '20:00',
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
    console.log(this.convertFacility());
    
  }

  public convertFacility(): any[] {
    const facilities = [];
    this.facilities.map(item => {
      item.facilitiesList.map(facility => {
        const { id , name , maxOccupancy , iconPath , occupiedHours} = facility;        
        const newFacility = {
          id:id,
          svgUrl:iconPath,
          title:name,
          maxParticipants:maxOccupancy,
          availability: [
            occupiedHours.map(obj => {
              return {
                startingHour:obj['fromHour'],
                endingHour:obj['tillHour'],
                totalTime:obj['totalTime'],
                user:obj['customerName']
              };
              
            })
          ]
        };
        facilities.push(newFacility);
      });
    });
    return facilities;
  }
}
