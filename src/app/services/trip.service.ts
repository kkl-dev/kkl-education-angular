import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { FreeSpace } from 'comrax-alex-airbnb-calendar';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/open-api/api/user.service';
import { SelectOption } from '../components/form/logic/question-base';
import { ForestCenter } from '../models/forest-center.model';
import { Area, ActivityType, FieldForestCenter, AgeGroup, Attribute, ParticipantType, Language, Country, Customer, BaseCustomer } from '../open-api';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor( public userService: UserService) { }

  //  forestCenters: any = {};

  centerField: FieldForestCenter = {
    id: 0,
    name: ''
  };
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[];
  // dateObj: any;
  formGroupSquadAssembles = [];
  dateRange: any;
  formOptions!: FieldForestCenter[];
  public centerFieldObj = new BehaviorSubject<any>({
    "id": 1,
    "name": "נס הרים",
    "iconPath": "assets/images/userImage.jpg",
    "acommodationList": [
      {
        "id": 20,
        "name": "בקתה",
        "maxOccupancy": 50,
        "totalUnits": 30,
        "img": "..href",
        "nameEng": "something"
      },
      {
        "id": 21,
        "name": "חדר",
        "maxOccupancy": 10,
        "totalUnits": 20,
        "img": "..href",
        "nameEng": "something"
      }
    ],
    "linkSite": "http://"
  });

  // sleepingDates: any = {
  //   from: '2021-07-01',
  //   till: '2021-07-13'
  // };

  public AvailableSleepingOptionsByDay = new BehaviorSubject<any>([
    {
      "date": "2021-09-03T00:00:00",
      "AvailableLodgingList": [
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "בקתה",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        },
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "אוהל",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        },
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "גיחה",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        }
      ]
    }
  ]);

  forestCenter = this.centerFieldObj.asObservable();
  AvailableSleepingOptions = this.AvailableSleepingOptionsByDay.asObservable();

  setFreeSpacesArray(freeSpacesArray: any) {
    this.freeSpacesArray = freeSpacesArray;
  }
 
  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
  }

  // updateSleepingDates() {
  //   this.getAvailableSleepingOptions()
  // }

  convertDatesFromSlashToMinus() {
    //for replacing the dash of dates to minus
    let from = this.sleepingDates.from.replace(/\//g, '-');
    let till = this.sleepingDates.till.replace(/\//g, '-');
    let sleepingDateObj = {
      from: from,
      till: till
    }
    return sleepingDateObj;
  }

  getAvailableSleepingOptions() {
    // this.convertDatesFromSlashToMinus() 
    let from = this.sleepingDates.from.replace(/\//g, '-');
    let till = this.sleepingDates.till.replace(/\//g, '-');

    console.log('this.centerFieldObj.value.id, from, till' + this.centerFieldObj.value.id, from, till)
    this.userService.getAvailableSleepingOptionsByDates(this.centerFieldObj.value.id, from, till).subscribe((sleepingAvailability: any) => {
      console.log('sleepingAvailability ==>', { sleepingAvailability });
      if (sleepingAvailability) {
        this.AvailableSleepingOptionsByDay.next(sleepingAvailability);
      }
    },
      error => {
        console.log({ error });
      });
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
