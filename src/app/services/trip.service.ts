import { Injectable } from '@angular/core';
import { FieldForestCenter } from '../api/';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../api/api/user.service';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  centerField: FieldForestCenter | undefined;
  dateObj: any;
  dateRange: any;
  formOptions!: FieldForestCenter[];
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
