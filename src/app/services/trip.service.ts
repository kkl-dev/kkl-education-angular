import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/open-api/api/user.service';
import { SelectOption } from '../components/form/logic/question-base';
import { ForestCenter } from '../models/forest-center.model';
import { Area, ActivityType, FieldForestCenter, AgeGroup, Attribute, ParticipantType, Language, Country, Customer, BaseCustomer } from '../open-api';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  centerField: FieldForestCenter | undefined;
  dateObj: any;
  formGroupSquadAssembles = [];
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

  constructor(private userService: UserService) { }

  changeForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
  }




  ageGroup = [];//to convert to model of comrax
  ageGroupOriginal: AgeGroup[];
  fieldForestCenters = [];//to convert to model of comrax
  fieldForestCentersOriginal: FieldForestCenter[];
  activityByAttribute = []
  customers = [];
  customersOriginal: BaseCustomer[]
  areas: Area[];
  attributes = [];
  attributesOriginal: Attribute[];
  participantTypes: ParticipantType[];
  languages: Language[];
  countries: Country[];
  getLookUp() {
    this.userService.getLookupFieldForestCenters().subscribe(
      response => {
        this.fieldForestCentersOriginal = response;
        response.forEach(element => {
          this.fieldForestCenters.push({ key: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAgeGroup().subscribe(
      response => {
        this.ageGroupOriginal = response;
        response.forEach(element => {
          this.ageGroup.push({ key: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    // this.userService.getCustomersByParams().subscribe(
    //     response => {
    //       console.log('response', response)
    //       this.customersByParams = response;
    //     },
    //     error => console.log(error),       // error
    //     () => console.log('completed')     // complete
    //   )
    this.userService.getCustomers().subscribe(
      response => {
        console.log('response', response)
        this.customersOriginal = response;
        response.forEach(element => {
          this.customers.push({ key: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getActivityByAttribute(1, '12').subscribe(
      response => {
        response.forEach(element => {
          this.activityByAttribute.push({ key: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAreas().subscribe(
      response => {
        console.log('response', response)
        this.areas = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAttributes().subscribe(
      response => {
        this.attributesOriginal = response;
        response.forEach(element => {
          this.attributes.push({ key: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getParticipantTypes().subscribe(
      response => {
        console.log('response', response)
        this.participantTypes = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getLanguages().subscribe(
      response => {
        console.log('response', response)
        this.languages = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getCountries().subscribe(
      response => {
        console.log('response', response)
        this.languages = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
}
