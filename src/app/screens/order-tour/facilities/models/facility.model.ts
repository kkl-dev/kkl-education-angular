export interface FacilityModel {
    date:string | Date;
    facilitiesList:FacilitiesList[];   
   }
   
   export interface FacilitiesList {
       id:string | number;
       name:string;
       maxOccupancy:number | string;
       iconPath:string;
       occupiedHours:OccupiedHours[];
   }
   
   export interface OccupiedHours {
       fromHour:string | Date;
       tillHour:string | Date;
       totalTime: string | number;
       customerName:string;
   }