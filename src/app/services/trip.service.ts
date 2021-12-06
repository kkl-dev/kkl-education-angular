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

  // public activityByAttr = new Subject([] any);
  public activityByAttr = new BehaviorSubject<any[]>(null)
  constructor(private userService: UserService, private squadBudgetService: SquadBudgetService, public squadClientService: SquadClientService) { }
  // 
  //  forestCenters: any = {};

  centerField: FieldForestCenter = {
    id: 0,
    name: ''
  };

  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[];
  isOneDayTrip: boolean;
  formGroupSquadAssembles = [];
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
        },
        {
          "structureId": 851,
          "gender": "בנות",
          "status": "תפוס"
        },
        {
          "structureId": 852,
          "gender": "בנים",
          "status": "תפוס"
        },
        {
          "structureId": 853,
          "gender": "מעורב",
          "status": "פנוי"
        },
        {
          "structureId": 1195,
          "gender": "בנות",
          "status": "פנוי"
        }
      ]
    }
  ]);

  totalAvailableUnits: any = []

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
    //console.log('this.freeSpacesArray: ', this.freeSpacesArray);
  }

  setfacilitiesArray(facilitiesArray: any) {
    this.facilitiesArray = facilitiesArray;
    //console.log('facilitiesArray: ', this.facilitiesArray);
  }

  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
    console.log('this. center  Field Obj: ', this.centerFieldObj);
    this.getAvailableSleepingOptions();
  }

  // updateSleepingDates() {
  //   this.getAvailableSleepingOptions()
  // }

  convertDatesFromSlashToMinus() {
    let str = this.sleepingDates.from.split("/");
    let str2 = this.sleepingDates.till.split("/");
    let sleepingDateObj = {
      from: str[2] + '-' + str[1] + '-' + str[0],
      till: str2[2] + '-' + str2[1] + '-' + str2[0]
    }
    return sleepingDateObj;
  }


  availableCabins = 0;
  availableRooms = 0;
  availableTents = 0;
  availableGicha = 0;

  getAvailableSleepingOptions() {
    let str = this.sleepingDates.from.split("/");
    let str2 = this.sleepingDates.till.split("/");
    let from = str[2] + '-' + str[1] + '-' + str[0];
    let till = str2[2] + '-' + str2[1] + '-' + str2[0];

    this.userService.getAvailableSleepingOptionsByDates(this.centerField.id, from, till).subscribe((sleepingAvailability: any) => {
      //console.log('sleeping Availability ==>', { sleepingAvailability });
      if (sleepingAvailability) {
        this.availableSleepingOptions = sleepingAvailability;
        //for maps
        this.availableUnitsForMap(0);
        this.AvailableSleepingOptionsByDay.next(sleepingAvailability);


        // this.availableCabins = 0;
        // this.availableRooms = 0;
        // this.availableTents = 0;
        // this.availableGicha = 0;
        // this.totalAvailableUnits = sleepingAvailability[0].sleepingOptions[0].maxOccupancy;
        // console.log("totalAvailableUnits: " + this.totalAvailableUnits)

        // let max = [];
        // sleepingAvailability[0].sleepingOptions.forEach(element => {
        //   max.push({ acoomodationTypeName: element.acoomodationTypeName, availableUnits: element.availableUnits });

        //   if (element.acoomodationTypeName == 'בקתה') {
        //     // console.log("totalAvailableUnits: " + element.availableUnits);
        //     this.availableCabins = element.availableUnits;
        //   }
        //   if (element.acoomodationTypeName == 'אוהל') {
        //     // console.log("totalAvailableUnits: " + element.availableUnits);
        //     this.availableTents = element.availableUnits;
        //   }
        //   if (element.acoomodationTypeName == 'חדר') {  //room
        //     //console.log("totalAvailableUnits: " + element.availableUnits);
        //     this.availableRooms = element.availableUnits;
        //   }
        //   if (element.acoomodationTypeName == 'גיחה') {
        //     // console.log("totalAvailableUnits: " + element.availableUnits);
        //     this.availableGicha = element.availableUnits;
        //   }
        // });
        // this.totalAvailableUnits = max;
        // console.log("totalAvailableUnits: ", this.totalAvailableUnits);

        // this.AvailableSleepingOptionsByDay.next(sleepingAvailability);

        // this.getMapFacilities(this.centerField.id, from, till);
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
    this.totalAvailableUnits = this.availableSleepingOptions[day].sleepingOptions[0].maxOccupancy;
    //console.log("totalAvailableUnits: " + this.totalAvailableUnits)

    let max = [];
    this.availableSleepingOptions[day].sleepingOptions.forEach(element => {
      max.push({ acoomodationTypeName: element.acoomodationTypeName, availableUnits: element.availableUnits });

      if (element.acoomodationTypeName == 'בקתה') {
        // console.log("totalAvailableUnits: " + element.availableUnits);
        this.availableCabins = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'אוהל') {
        // console.log("totalAvailableUnits: " + element.availableUnits);
        this.availableTents = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'חדר') {  //room
        //console.log("totalAvailableUnits: " + element.availableUnits);
        this.availableRooms = element.availableUnits;
      }
      if (element.acoomodationTypeName == 'גיחה') {
        // console.log("totalAvailableUnits: " + element.availableUnits);
        this.availableGicha = element.availableUnits;
      }
    });
    this.totalAvailableUnits = max;
    //console.log("totalAvailableUnits: ", this.totalAvailableUnits);


    this.getMapFacilities(this.centerField.id, "2022-10-19", "2022-10-19");
  }

  getMapFacilities(centerField, from, till) {
    //getMapFacilities for sending sleeping id to map
    this.userService.getMapFacilities(centerField, from, till).subscribe((lodgingList: any) => {
      //console.log('lodging Facility List Array ==>', { lodgingList });
      this.lodgingFacilityListArray = [];
      let temp = []
      // let totalUnits = {
      //   cabin: 0,
      //   room: 0,
      //   tent: 0,
      //   camping: 0
      // };
      let centerFieldName = '';

      switch (this.centerField.name) {
        case 'נס הרים':
          centerFieldName = 'מרכז שדה נס הרים'
          break;
        case 'ציפורי':
          centerFieldName = 'מרכז שדה ציפורי'
          break;
        // case 'אילנות':
        //   centerFieldName = 'אילנות מערב'
        //   break;
        case 'שוני':
          centerFieldName = 'מרכז שדה שוני'
          break;
        // case 'בית אש\"ל':
        //   centerFieldName = 'מצפה בית אשל'
        //   break;
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


      // for (let index = 0; index < this.totalAvailableUnits.length; index++) {
      //   if (this.totalAvailableUnits[index].acoomodationTypeName == 'בקתה' ) {
      //     availableRooms = this.totalAvailableUnits[index].availableUnits;
      //   }

      // }
      console.log("totalAvailableUnits: ", this.totalAvailableUnits);
      let availableCabins = this.availableCabins;
      let availableRooms = this.availableRooms;
      let availableTents = this.availableTents;
      let availableGicha = this.availableGicha;

      //lodgingList[0].lodgingFacilityList = lodgingList[0].lodgingFacilityList.filter(aco => aco.structureType);
      lodgingList[0].lodgingFacilityList.forEach(element => {
        //console.log(element.structureType);
        //get totalAvailableUnits of each accumondation type
        // for (let index = 0; index < this.totalAvailableUnits[0].availableUnits; index++) {
        //   temp.push({structureId: element.structureId, gender: "בנות", status: "פנוי" });
        // }
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
      //console.log("this.lodgingFacilityListArray", this.lodgingFacilityListArray);
      this.lodgingFacilityListArrayObservable.next(this.lodgingFacilityListArray);


    },
      error => {
        console.log({ error });
      });
  }
  payerCustomer = {} as BaseCustomer;
  Customer = {} as BaseCustomer;
  ageGroup = [];//to convert to model of comrax
  ageGroupOriginal: AgeGroup[];
  fieldForestCenters = [];//to convert to model of comrax
  fieldForestCentersOriginal: FieldForestCenter[];
  activityByAttribute = [];
  activityByAttributeOriginal: ActivityType[]
  customers = [];
  customersOriginal: BaseCustomer[];
  baseCustomer: BaseCustomer;
  areasOriginal: Area[];
  areas: any[];
  attributes = [];
  attributesOriginal: TripAttribute[];
  participantTypes: ParticipantType[];
  languages: Language[];
  countries: Country[];
  budget: Budget;
  budgetExpensesAndIncome: Budget;
  budgetExpenses = [];
  budgetIncome = [];
  budgetByParam = {} as BudgetByParams;

  getLookupFieldForestCenters() {
    this.userService.getLookupFieldForestCenters().subscribe(
      response => {
        console.log(response);
        this.formOptions = response;
        //filter for showing only forest center with accommodationList
        this.formOptions = this.formOptions.filter(aco => aco.accommodationList.length > 0);
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getActivityLookupsByAttribute(attributeId: number) {
    this.userService.getActivityByAttribute(attributeId).subscribe(
      response => {
        this.activityByAttributeOriginal = response;
        this.activityByAttribute = [];
        response.forEach(element => {
          this.activityByAttribute.push({ label: element.name, value: element.id.toString() });
        });
        console.log('activityByAttribute is :', this.activityByAttribute);
        this.activityByAttr.next(this.activityByAttribute);
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getBudgetKKl1(budgetByParam: any) {
    this.userService.getBadgetKKl(budgetByParam).subscribe(
      response => {
        console.log('response', response)
        this.budget = response;
        if (this.budget.listCity !== null) {
          var list = [];
          this.budget.listCity.forEach(element => {
            list.push({ label: element.name, value: element.id.toString() });
          });
          var index = this.squadBudgetService.questions.findIndex(o => o.key === 'location');
          if (list.length === 1) {
            this.squadBudgetService.questions[index].group.questions[0].value = list[0].value;
            this.squadBudgetService.questions[index].group.questions[0].label = list[0].label;
          }
          else { this.squadBudgetService.questions[index].group.questions[0].inputProps.options = list; }
          if (this.budget.type !== undefined) {
            this.squadBudgetService.budget.type = this.budget.desc;
            this.squadBudgetService.budget.budget = this.budget.kklAmount;
            this.squadBudgetService.budget.expense = this.budget.customerAmount;
            this.squadBudgetService.budget.deliver = this.budget.execution;
            this.squadBudgetService.budget.overflow = this.budget.balanceFin;
            this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
          }
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }


  getBudgetKKl(budgetByParam: any) {
    this.userService.getBadgetKKl(budgetByParam).subscribe(
      response => {
        console.log('response', response)
        this.budget = response;
        if (this.budget.listCity !== null) {
          var list = [];
          this.budget.listCity.forEach(element => {
            list.push({ label: element.name, value: element.id.toString() });
          });
          var index = this.squadBudgetService.questions.findIndex(o => o.key === 'location');
          if (list.length === 1) {
            this.squadBudgetService.questions[index].group.questions[0].value = list[0].value;
            this.squadBudgetService.questions[index].group.questions[0].label = list[0].label;
          }
          else { this.squadBudgetService.questions[index].group.questions[0].inputProps.options = list; }
        }
        let incomeIndex= this.squadBudgetService.questions.findIndex(o => o.key === 'budgetIncome');
        let expenseIndex= this.squadBudgetService.questions.findIndex(o => o.key === 'budgetExpense');
        if(this.squadBudgetService.questions[incomeIndex].inputProps.options.length>0){
          this.squadBudgetService.questions[incomeIndex].value='';
          this.squadBudgetService.questions[incomeIndex].label='תת סעיף תקציב הכנסות';
          this.squadBudgetService.questions[incomeIndex].inputProps.options = [];
        }
       
        if(this.squadBudgetService.questions[expenseIndex].inputProps.options.length>0){
          this.squadBudgetService.questions[expenseIndex].value='';
          this.squadBudgetService.questions[expenseIndex].label='תת סעיף תקציב הוצאות';
          this.squadBudgetService.questions[expenseIndex].inputProps.options = [];
        }
      
          if (this.budget.type !== undefined) {
            this.squadBudgetService.budget.type = this.budget.desc;
            this.squadBudgetService.budget.budget = this.budget.kklAmount;
            this.squadBudgetService.budget.expense = this.budget.customerAmount;
            this.squadBudgetService.budget.deliver = this.budget.execution;
            this.squadBudgetService.budget.overflow = this.budget.balanceFin;
            this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
          }
        
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }


  getBudgetExpensesAndIncome(budgetByParam: any) {
    this.userService.getBadgetExpensesAndIncome(budgetByParam).subscribe(
      response => {
        console.log('response', response)
        this.budgetExpensesAndIncome = response;
        if (this.budget.type !== undefined) {
          this.squadBudgetService.budget.budget = this.budgetExpensesAndIncome.kklAmount;
          this.squadBudgetService.budget.expense = this.budgetExpensesAndIncome.customerAmount;
          this.squadBudgetService.budget.deliver = this.budgetExpensesAndIncome.execution;
          this.squadBudgetService.budget.overflow = this.budgetExpensesAndIncome.balanceFin;
          this.squadBudgetService.list = this.squadBudgetService.setList(this.squadBudgetService.list);
        }
        let index1 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetIncome');
        let index2 = this.squadBudgetService.questions.findIndex(o => o.key === 'budgetExpense');
        this.squadBudgetService.questions[index1].inputProps.options=[];
        this.squadBudgetService.questions[index1].value='';
        this.squadBudgetService.questions[index2].inputProps.options=[];
        this.squadBudgetService.questions[index2].value='';
        // if (this.budget.type == 1) {
        if (this.budget.type != undefined) {
          this.budgetIncome=[];
          this.budgetExpenses=[];
          response.subBudgetIncomeList.forEach(element => {
            this.budgetIncome.push({ label: element.name, value: element.id.toString() });
          });
          this.squadBudgetService.questions[index1].inputProps.options = this.budgetIncome;
          this.squadBudgetService.questions[index1].value = response.incomeId.toString();
          this.squadBudgetService.questions[index1].label= response.incomeName;
          response.subBudgetExpenseList.forEach(element => {
            this.budgetExpenses.push({ label: element.name, value: element.id.toString() });
          });
          this.squadBudgetService.questions[index2].inputProps.options = this.budgetExpenses;
          this.squadBudgetService.questions[index2].value = response.expensesId.toString();
          this.squadBudgetService.questions[index2].label= response.expensesName;
        }
         else {
        this.squadBudgetService.questions[index1].value = response.incomeId.toString();
        this.squadBudgetService.questions[index1].label = response.incomeName;
        this.squadBudgetService.questions[index2].value = response.expensesId.toString();
        this.squadBudgetService.questions[index2].label = response.expensesName;
       }
        this.budgetByParam.budget.cityId = response.cityId
        this.budgetByParam.budget.expensesId = response.expensesId
        this.budgetByParam.budget.incomeId = response.incomeId
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getCustomersByParameters(customer, clientPool, indx1, indx2) {
    this.userService.getCustomersByParameters(customer, clientPool).subscribe(
      response => {
        console.log('response', response)
        this.customersOriginal = response;
        this.customers = [];
        response.forEach(element => {
          this.customers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.customers;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
  getKKLWorkers(customer, indx1, indx2) {
    this.userService.getKKLWorkers(customer).subscribe(
      response => {
        console.log('response', response)
        this.customersOriginal = response;
        this.customers = [];
        response.forEach(element => {
          this.customers.push({ label: element.name, value: element.id.toString() });
        });
        this.squadClientService.questions[indx1].group.questions[indx2].inputProps.options = this.customers;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
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
