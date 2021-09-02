import { Injectable } from '@angular/core';
import { FieldForestCenter } from 'src/app/open-api/model/fieldForestCenter';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TripService {
  centerField: FieldForestCenter | undefined;
  dateObj: any;
  
  public centerFieldObj = new BehaviorSubject<any>({
    "id": 101,
    "name": "נס הרים",
    "iconPath": "assets/images/userImage.jpg",
    "acommodationList": [
      {
        "id": 20,
        "name": "בקתה",
        "maxOccupancy": 40,
        "totalUnits": 40,
        "img": "..href",
        "nameEng": "something"
      }
    ],
    "linkSite": "http://"
  });
  forestCenter = this.centerFieldObj.asObservable();
  
  constructor() { }

  changeForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
  }
  
}
