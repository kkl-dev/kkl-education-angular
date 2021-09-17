import { Injectable } from '@angular/core';
import { FieldForestCenter } from 'src/app/open-api/model/fieldForestCenter';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/open-api/api/user.service';
import { TripInfo } from '../open-api';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  centerField: FieldForestCenter={
    id: 0,
    name: ''
  };
  dateObj: any;
  dateRange: any;
  formOptions!: FieldForestCenter[];
  tripInfo: TripInfo
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

  constructor(public userService: UserService) { }

  changeForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
  }
  getLookupFieldForestCenters() {
    this.userService.getLookupFieldForestCenters().subscribe(
      response => {
        console.log(response)
        this.formOptions = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
}
