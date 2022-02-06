import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { FreeSpace } from 'comrax-alex-airbnb-calendar';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from 'src/app/open-api';
import { SelectOption } from '../components/form/logic/question-base';
import { ForestCenter } from '../models/forest-center.model';
import { Area, FieldForestCenter, AgeGroup, TripAttribute, ParticipantType, Language, Country, Customer, BaseCustomer, ActivityType, BudgetByParams, Budget } from 'src/app/open-api';
import { SquadBudgetService } from '../screens/order-tour/squad-assemble/components/squad-budget/squad-budget.service';
import { SquadClientService } from '../screens/order-tour/squad-assemble/components/squad-client/squad-client.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  public activityByAttr = new BehaviorSubject<any[]>(null)
  constructor(private userService: UserService, private squadBudgetService: SquadBudgetService, public squadClientService: SquadClientService) {}
  centerField: FieldForestCenter = {
    id: 0,
    name: ''
  };
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[];
  isOneDayTrip: boolean;
  //formGroupSquadAssembles = [];
  dateRange: any;
  formOptions!: FieldForestCenter[];
  
  lodgingFacilityListArrayObservable: any = new BehaviorSubject<any>([
    {
      "fieldForestCenterName": "מרכז שדה לביא",
      "lodgingFacilityList": [
        {
          "structureId": 849,
          "gender": "בנים",
          "status": "פנוי"
        },
        {
          "structureId": 850,
          "gender": "מעורב",
          "status": "פנוי"
        }
      ]
    }
  ]);

  availableCabins = 0;
  availableRooms = 0;
  availableTents = 0;
  availableGicha = 0;

  centerFieldObj = new BehaviorSubject<any>({
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
      }
    ],
    "linkSite": "http://"
  });

  AvailableSleepingOptionsByDay = new BehaviorSubject<any>([
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
        }
      ]
    }
  ]);
  forestCenter = this.centerFieldObj.asObservable();
  AvailableSleepingOptions = this.AvailableSleepingOptionsByDay.asObservable();
  lodgingFacilityListArray = this.lodgingFacilityListArrayObservable.asObservable();
  availableSleepingOptions: any = [];
  facilitiesArray: any = [];

  setFreeSpacesArray(freeSpacesArray: any) {
    this.freeSpacesArray = freeSpacesArray;
  }

  setfacilitiesArray(facilitiesArray: any) {
    this.facilitiesArray = facilitiesArray;
  }

  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
    console.log('this. center  Field Obj: ', this.centerFieldObj);
    this.getAvailableSleepingOptions();
  }

  convertDatesFromSlashToMinus() {
    let str = this.sleepingDates.from.split("/");
    let str2 = this.sleepingDates.till.split("/");
    let sleepingDateObj = {
      from: str[2] + '-' + str[1] + '-' + str[0],
      till: str2[2] + '-' + str2[1] + '-' + str2[0]
    }
    return sleepingDateObj;
  }

  getAvailableSleepingOptions() {
    let str = this.sleepingDates.from.split("/");
    let str2 = this.sleepingDates.till.split("/");
    let from = str[2] + '-' + str[1] + '-' + str[0];
    let till = str2[2] + '-' + str2[1] + '-' + str2[0];

    this.userService.getAvailableSleepingOptionsByDates(this.centerField.id, from, till).subscribe((sleepingAvailability: any) => {
      if (sleepingAvailability) {
        this.availableSleepingOptions = sleepingAvailability;
        //for maps
        this.availableUnitsForMap(0);
        this.AvailableSleepingOptionsByDay.next(sleepingAvailability);
      }
    },
      error => {
        console.log({ error });
      });
  }

  availableUnitsForMap(day) {

    this.availableCabins = 0;
    this.availableRooms = 0;
    this.availableTents = 0;
    this.availableGicha = 0;

    this.availableSleepingOptions[day].sleepingOptions.forEach(element => {
      if (element.acoomodationTypeName == 'בקתה') {
        this.availableCabins = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'אוהל') {
        this.availableTents = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'חדר') {  //room
        this.availableRooms = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'גיחה') {
        this.availableGicha = element.availableUnits;
      }
    });
    this.getMapFacilities(this.centerField.id, "2022-10-19", "2022-10-19");
  }

  getMapFacilities(centerField, from, till) {
    //getMapFacilities for sending sleeping id to map
    this.userService.getMapFacilities(centerField, from, till).subscribe((lodgingList: any) => {
      //console.log('lodging Facility List Array ==>', { lodgingList });
      this.lodgingFacilityListArray = [];
      let temp = []
      let centerFieldName = '';

      switch (this.centerField.name) {
        case 'נס הרים':
          centerFieldName = 'מרכז שדה נס הרים'
          break;
        case 'ציפורי':
          centerFieldName = 'מרכז שדה ציפורי'
          break;
        case 'שוני':
          centerFieldName = 'מרכז שדה שוני'
          break;
        case 'יתיר':
          centerFieldName = 'מרכז שדה יתיר'
          break;
        case 'לביא':
          centerFieldName = 'מרכז שדה לביא'
          break;
        default:
          centerFieldName = 'מרכז שדה לביא';
          break;
      }
      let availableCabins = this.availableCabins;
      let availableRooms = this.availableRooms;
      let availableTents = this.availableTents;
      let availableGicha = this.availableGicha;

      lodgingList[0].lodgingFacilityList.forEach(element => {
        let gender: string;
        const rand = Math.floor(Math.random() * 3)
        if (rand == 0)
          gender = "בנים";
        else if (rand == 1)
          gender = "בנות";
        else
          gender = "מעורב";
        if (element.structureType == 'בקתה') {
          if (availableCabins > 0) {
            availableCabins = availableCabins - 1;
            temp.push({ structureId: element.structureId, gender: gender, status: "פנוי" });
          } else {
            temp.push({ structureId: element.structureId, gender: gender, status: "תפוס" });
          }
        }
        else if (element.structureType == 'חדר') {
          if (availableRooms > 0) {
            availableRooms = availableRooms - 1;
            temp.push({ structureId: element.structureId, gender: gender, status: "פנוי" });
          } else {
            temp.push({ structureId: element.structureId, gender: gender, status: "תפוס" });
          }
        }
        else if (element.structureType == 'אוהל') {
          if (availableTents > 0) {
            availableTents = availableTents - 1;
            temp.push({ structureId: element.structureId, gender: gender, status: "פנוי" });
          } else {
            temp.push({ structureId: element.structureId, gender: gender, status: "תפוס" });
          }
        }
        else if (element.structureType == 'גיחה') {
          if (availableGicha > 0) {
            availableGicha = availableGicha - 1;
            temp.push({ structureId: element.structureId, gender: gender, status: "פנוי" });
          } else {
            temp.push({ structureId: element.structureId, gender: gender, status: "תפוס" });
          }
        }
        else {
          temp.push({ structureId: element.structureId, gender: gender, status: "תפוס" });
        }
      });
      this.lodgingFacilityListArray.push({ fieldForestCenterName: centerFieldName }, { lodgingFacilityList: temp });
      this.lodgingFacilityListArrayObservable.next(this.lodgingFacilityListArray);
    },
      error => {
        console.log({ error });
      });
  }
  
  //payerCustomer = {} as BaseCustomer;
  //Customer = {} as BaseCustomer;
  ageGroup = [];//to convert to model of comrax
  ageGroupOriginal: AgeGroup[];
  fieldForestCenters = [];//to convert to model of comrax
  fieldForestCentersOriginal: FieldForestCenter[];
  // activityByAttribute = [];
  // activityByAttributeOriginal: ActivityType[]
  // customers = [];
  // customersOriginal: BaseCustomer[];
  // baseCustomer: BaseCustomer;
  areasOriginal: Area[];
  areas: any[];
  attributes = [];
  attributesOriginal: TripAttribute[];
  participantTypes: ParticipantType[];
  languages: Language[];
  countries: Country[];
  // budget: Budget;
  // budgetExpensesAndIncome: Budget;
  // budgetExpenses = [];
  // budgetIncome = [];
  // budgetByParam = {} as BudgetByParams;

  getCustomer(customerId) {
    this.userService.getCustomer(customerId).subscribe(
      response => {
        console.log('response', response)
        // this.baseCustomer = response.BaseCustomer;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  
  getLookUp() {
    this.userService.getLookupFieldForestCenters().subscribe(
      response => {
        this.fieldForestCentersOriginal = response;
        this.fieldForestCentersOriginal = response.filter(aco => aco.accommodationList.length > 0);
        this.fieldForestCentersOriginal.forEach(element => {
          this.fieldForestCenters.push({ label: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAgeGroup().subscribe(
      response => {
        this.ageGroupOriginal = response;
        //this.ageGroup=[];
        response.forEach(element => {
          this.ageGroup.push({ label: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAreas().subscribe(
      response => {
        console.log('response', response)
        this.areasOriginal = response;
        response.forEach(element => {
          this.areas.push({ label: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    this.userService.getAttributes().subscribe(
      response => {
        this.attributesOriginal = response;
        //this.attributes=[];
        response.forEach(element => {
          this.attributes.push({ label: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
    // this.userService.getParticipantTypes().subscribe(
    //   response => {
    //     console.log('response', response)
    //     this.participantTypes = response;
    //   },
    //   error => console.log(error),       // error
    //   () => console.log('completed')     // complete
    // )
    // this.userService.getLanguages().subscribe(
    //   response => {
    //     console.log('response', response)
    //     this.languages = response;
    //   },
    //   error => console.log(error),       // error
    //   () => console.log('completed')     // complete
    // )
    // this.userService.getCountries().subscribe(
    //   response => {
    //     console.log('response', response)
    //     this.languages = response;
    //   },
    //   error => console.log(error),       // error
    //   () => console.log('completed')     // complete
    // )
  }
}
