import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { OrderService, TransportOrder, OrderEvent, EconomyOrder, OrderItemCommonDetails, Order, GuidanceOrder, HostingOrder, SiteOrder, SecuringOrder, MusicActivationOrder, Settlement } from 'src/app/open-api';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeneralFormService {
  supplierList = [];
  itemsList = [];
  tripId: number;
  centerFieldObj;
  tripInfo: any;
  peopleInTrip: number
  public transportOrderList: TransportOrder[] = [];

  public economyOrderList: EconomyOrder[] = [];
  public gudianceOrderList: GuidanceOrder[] = [];
  public hostingOrderList: HostingOrder[] = [];
  public siteOrderList: SiteOrder[] = [];
  public securingOrderList: SecuringOrder[] = [];
  public musicOrderList: MusicActivationOrder[] = [];
  public settlementList = [];
  public languageList = [];
  originalItemList = [];
  originalSupplierList = [];
  public siteList = [];
  tripOrdersList: OrderEvent[];

  //public tempOrderReduce = new BehaviorSubject<any>(null)
  public tempOrderReduce = new BehaviorSubject<{ tempOrderReduce: any, orderType: any }>(null)
  public tableData = new Subject();
  public enableButton = new Subject<boolean>();
  //public isSaveOrderSucceeded = new Subject<boolean>();


  //centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
  constructor(private orderService: OrderService, private squadAssembleService: SquadAssembleService, private _dialog: MatDialog,
  ) { }
  public details: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'supplierId',
      label: 'ספק',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: this.supplierList,
      },
    }),
    new QuestionSelect({
      key: 'itemId',
      label: 'בחר פריט',
      type: 'select',
      value: '',
      validations: [Validators.required],
      inputProps: {
        options: this.itemsList,
      },
    }),

    new QuestionTextbox({
      key: 'quantity',
      label: 'כמות',
      value: '1',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'peopleInTrip',
      label: 'משתתפים',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'itemCost',
      label: 'מחיר פריט בודד',
      value: '',
      type: 'number',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingSupplier',
      label: 'סך עלות ספק',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingCustomer',
      label: 'סך עלות לקוח',
      value: '',
      validations: [Validators.required],
    }),

    // new QuestionTextbox({
    //   key: 'isVat',
    //   label: 'האם כולל מע"מ',
    //   value: '',
    //   validations: [Validators.required],
    // }),

    new QuestionSelect({
      key: 'startDate',
      icon: 'date_range',
      label: 'תאריך איסוף',
      type: 'select',
      inputProps: {

      },
      validations: [Validators.required],
    }),
    new QuestionSelect({
      key: 'endDate',
      icon: 'date_range',
      label: 'תאריך פיזור',
      type: 'select',
      inputProps: {

      },
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'startHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'time',
      // validations: [Validators.required],
      // inputProps: {
      //   // labelSize: 's5',
      // },
    }),

    new QuestionTextbox({
      key: 'endHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'time',
      // validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'location',
      label: 'מיקום',
      value: '',
      icon: 'place',
      // validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),


  ]
  public comments: QuestionBase<string>[] = [
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: 6,
      rows: 6,
      value: '',
    }),
  ];
  public transport: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'scatterLocation',
      label: 'מקום פיזור',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
    new QuestionSelect({
      key: 'exitPoint',
      label: 'נקודת יציאה',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: this.settlementList
      },
    }),

  ]
  public economy: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'regularDishesNumber',
      label: 'מספר מנות רגילות',
      value: '',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'vegetarianDishesNumber',
      label: 'מספר מנות צמחוניות',
      value: '',
      // validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'veganDishesNumber',
      label: 'מספר מנות טבעוניות',
      value: '',
      // validations: [Validators.required],
    }),
  ]

  public guidance: QuestionBase<string>[] = [

    new QuestionTextbox({
      key: 'scatterLocation',
      label: 'מקום פיזור',
      value: '',
      // validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
    new QuestionTextbox({
      key: 'guideName',
      label: 'שם המדריך',
      value: '',
      // validations: [Validators.required],
    }),
    new QuestionSelect({
      key: 'languageGuidance',
      label: 'שפת הדרכה',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: this.languageList
      },
    }),
    new QuestionTextbox({
      key: 'guideInstructions',
      label: 'הוראות הדרכה',
      value: '',
      cols: 3,
      // validations: [Validators.required],
    }),
  ]

  // public siteQuestion = new QuestionSelect({
  //   key: 'siteCode',
  //   label: 'בחר אתר',
  //   type: 'select',
  //   validations: [Validators.required],
  //   inputProps: {
  //     options: this.siteList,  
  //   },
  // })

  public site: QuestionBase<string>[] = [

    new QuestionSelect({
      key: 'siteCode',
      label: 'בחר אתר',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: this.siteList,
      },
    }),
    new QuestionTextbox({
      key: 'siteURL',
      label: 'כתובת האתר באינטרנט',
      value: '',
    }),
    new QuestionTextbox({
      key: 'totalHours',
      label: 'סה"כ שעות',
      value: '',

    }),

  ]


  public securing: QuestionBase<string>[] = [

    new QuestionTextbox({
      key: 'scatterLocation',
      label: 'מקום פיזור',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
    // new QuestionTextbox({
    //   key: 'guardName',
    //   label: 'שם המאבטח',
    //   value: '',

    // }),

  ]

  public musicActivation: QuestionBase<string>[] = [

    new QuestionTextbox({
      key: 'totalHours',
      label: 'סה"כ שעות',
      value: '',

    }),

  ]


  public questionGroups: QuestionGroup[] = [
    {
      key: 'details',
      questions: this.details,
      cols: 8,
    },
    {
      key: 'comments',
      questions: this.comments,
      hasBottomButton: true,
      cols: 8,
    },
  ];

  public setInitialValues(
    questions: QuestionBase<string | number | Date | QuestionGroup>[],
    data: any, isItemOrderExist
  ) {
    questions.map((control: QuestionBase<string | number | Date | QuestionGroup>) => {
      // control.value = data[control.key]
      let startDate = data.globalParameters.startDate;
      let endDate = data.globalParameters.endDate;
      control.value = data.globalParameters[control.key];
      if (control.key == 'itemId') {
        if (data.globalParameters[control.key] != undefined)
          control.value = data.globalParameters[control.key].toString();
      }
      if (control.key == 'peopleInTrip' && !isItemOrderExist) {
        control.value = this.squadAssembleService.peopleInTrip;
      }
      if (control.key == 'startHour' && data.globalParameters[control.key].includes('T')) {
        control.value = this.setTimeFormat(data.globalParameters[control.key]);
      }
      if (control.key == 'endHour' && data.globalParameters[control.key].includes('T')) {
        control.value = this.setTimeFormat(data.globalParameters[control.key]);
      }
      if (control.key == 'startDate' && (data.globalParameters[control.key]).includes('T')) {
        control.value = this.changeDateFormat(data.globalParameters[control.key], 'israel');
      }
      if (control.key == 'endDate' && (data.globalParameters[control.key]).includes('T')) {
        control.value = this.changeDateFormat(data.globalParameters[control.key], 'israel');
      }
      if (control.key == 'quantity' && data.globalParameters[control.key] == undefined) {
        control.value = '1';
      }
      // if (control.key === 'comments') {
      //   control.value = data;
      // }
      // if (control.key === 'endHour') {
      //   var time = new Date(data[control.key]);
      //   control.value = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      //   // control.value = time;
      // }
    });
  }

  public updateTempOrderReduce(temp, orderType) {
    this.tempOrderReduce.next({ tempOrderReduce: temp, orderType: orderType });
    //this.tempOrderReduce.next(temp);
  }

  public setFormValues(data: any, isItemOrderExist) {
    this.questionGroups.map((group: QuestionGroup) => {
      this.setInitialValues(group.questions, data, isItemOrderExist);
    });
  }

  setDatesValues() {
    let tripDetails = this.tripInfo.trip;
    let startDate = tripDetails.tripStart;
    let endDate = tripDetails.tripEnding;
    let str = startDate.split("T");
    let str2 = endDate.split("T");
    let from = str[0]
    let till = str2[0];
    let date1 = new Date(from);
    let date2 = new Date(till);

    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    console.log(totalDays);
    let newDate = new Date(date1.setDate(date1.getDate()));
    let datesArr = [];
    for (let i = 0; i <= totalDays; i++) {
      let newDateString = `${newDate.getDate()}/${(newDate.getMonth() + 1).toString()
        }/${newDate.getFullYear()}`;
      // const newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString()
      //   }-${newDate.getDate()}`;
      let subNewDateString = newDateString.split('/');
      if (+subNewDateString[0] < 10)
        subNewDateString[0] = 0 + subNewDateString[0];
      if (+subNewDateString[1] < 10)
        subNewDateString[1] = 0 + subNewDateString[1];
      newDateString = subNewDateString[0] + '/' + subNewDateString[1] + '/' + subNewDateString[2];

      datesArr.push({
        label: newDateString,
        value: newDateString
      });
      newDate = new Date(date1.setDate(date1.getDate() + 1));
    }
    console.log('datesArr is : ', datesArr);
    let startDateindex = this.details.findIndex(i => i.key == 'startDate');
    let endDateIndex = this.details.findIndex(i => i.key == 'endDate');
    this.details[startDateindex].inputProps.options = datesArr;
    this.details[endDateIndex].inputProps.options = datesArr;
  }

  setTimeFormat(hour) {
    let hourStr = hour.split("T");
    let hourFormat = hourStr[1];
    return hourFormat;
  }

  changeDateFormat(date, format) {
    let dateFormat;
    let subDate;
    if (format == 'israel') {
      let subDateArr = date.split('T');
      let subDate1 = subDateArr[0];
      subDate = subDate1.split('-');
      dateFormat = subDate[2] + '/' + subDate[1] + '/' + subDate[0]
    }
    else {
      subDate = date.split("/");
      dateFormat = subDate[2] + '-' + subDate[1] + '-' + subDate[0]; //UTC format
    }
    return dateFormat;
  }

  clearFormFields() {

    let supplierIndex = this.details.findIndex(i => i.key === 'supplierId');
    this.details[supplierIndex].inputProps.options = [];
    this.supplierList = [];
    let itemIndex = this.details.findIndex(i => i.key === 'itemId');
    this.details[itemIndex].value = '';
    let statDateIndex = this.details.findIndex(i => i.key === 'startDate');
    this.details[statDateIndex].value = '';
    let endDateIndex = this.details.findIndex(i => i.key === 'endDate');
    this.details[endDateIndex].value = '';
    let statHourIndex = this.details.findIndex(i => i.key === 'startHour');
    this.details[statHourIndex].value = '';
    let endHourIndex = this.details.findIndex(i => i.key === 'endHour');
    this.details[endHourIndex].value = '';
    let quantityIndex = this.details.findIndex(i => i.key === 'quantity');
    this.details[quantityIndex].value = '1';
    let itemCostIndex = this.details.findIndex(i => i.key === 'itemCost');
    this.details[itemCostIndex].value = '';
    let billingSupplierIndex = this.details.findIndex(i => i.key === 'billingSupplier');
    this.details[billingSupplierIndex].value = '';
    let billingCustomerIndex = this.details.findIndex(i => i.key === 'billingCustomer');
    this.details[billingCustomerIndex].value = '';
    let locationIndex = this.details.findIndex(i => i.key === 'location');
    this.details[locationIndex].value = '';
    this.comments[0].value = '';
  }


  mapOrderList(orderList) {
    //this.tripOrdersList= orderList;

    this.transportOrderList = [];
    this.securingOrderList = [];
    this.siteOrderList = [];
    this.economyOrderList = [];
    this.gudianceOrderList = [];
    this.hostingOrderList = [];
    this.musicOrderList = [];
    orderList.forEach(element => {
      if (element.order.orderType.id == 1) {
        this.transportOrderList.push(element)
      }
      if (element.order.orderType.id == 2) {
        this.securingOrderList.push(element)
      }
      if (element.order.orderType.id == 3) {
        this.siteOrderList.push(element)
      }
      if (element.order.orderType.id == 4) {
        this.economyOrderList.push(element)
      }
      if (element.order.orderType.id == 6) {
        this.gudianceOrderList.push(element)
      }
      if (element.order.orderType.id == 7) {
        this.hostingOrderList.push(element)
      }
      if (element.order.orderType.id == 10) {
        this.musicOrderList.push(element)
      }
    });
  }


  //  addOrder(item: any,orderType) {  
  //     this.orderService.addOrder( item).subscribe(res => {
  //       console.log(res); 
  //       this.tableData.next(res);
  //       this.enableButton.next(true);
  //       //this.isSaveOrderSucceeded.next(true);
  //       this.setOrderList(res,orderType,'adding');
  //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
  //         width: '500px',
  //         data: { message: 'ההזמנה נשמרה בהצלחה', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
  //       })
  //     }, (err) => {
  //       console.log(err);
  //       //this.isSaveOrderSucceeded.next(false);
  //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
  //         width: '500px',
  //         data: { message: 'אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
  //       })
  //     })
  //   }
  //   editOrder(item: any,orderType) { 
  //     this.orderService.editOrder(item).subscribe(res => {
  //       console.log(res);  
  //       this.setOrderList(res, orderType,'updating');
  //       //this.isSaveOrderSucceeded.next(true);
  //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
  //         width: '500px',
  //         data: { message: 'ההזמנה עודכנה בהצלחה', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
  //       })
  //     }, (err) => {
  //       console.log(err);
  //       //this.isSaveOrderSucceeded.next(false);
  //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
  //         width: '500px',
  //         data: { message: 'אירעה שגיאה בעדכון ההזמנה, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
  //       })

  //     })

  // }
  findInvalidControls(form: any) {
    const controls = form.controls.details.controls;
    var indx = 0;
    for (const key in controls) {
      if (controls[key].invalid) {
        var name = this.questionGroups[0].questions[indx].label;
        if (name === 'בחר פריט') name = 'פריט';
        if (name === 'בחר אתר') name = 'אתר';
        return name;
      }
      indx++;
    }
    return null;
  }


  setOrderList(res, orderTypeId, operation, isTempurary) {
    switch (orderTypeId) {
      case 1:
        let t = {} as TransportOrder;
        let tranArr: TransportOrder[] = [];
        if (res.length > 1) {
          for (let i = 0; i < res.length; i++) {
            let trans = {} as TransportOrder;
            trans = res[i];
            tranArr.push(trans);
          }
        }
        else if (res.length == 1)
          t = res[0];
           this.transportOrderList=[];
           if(res.length>1)
           this.transportOrderList= tranArr;
           else
           this.transportOrderList.push(t);
           if(operation=='adding' && isTempurary==true)
           this.updatetempOrderReduce(res,orderTypeId);
          break;
        case 2:
            let securing = {} as SecuringOrder;
            let securingArr : SecuringOrder[]=[];
            if(res.length>1){
              for (let i = 0; i < res.length; i++) {
                 let securing1= {} as SecuringOrder;
                 securing1= res[i];
                 securingArr.push(securing1);
              }
           }
           else if(res.length==1)
           securing = res[0];
            this.securingOrderList=[];
            if(res.length>1)
            this.securingOrderList= securingArr;
            else
             this.securingOrderList.push(securing);
            break;
      
        case 3:
            let site = {} as SiteOrder;
            let siteArr: SiteOrder[]=[];
            if(res.length>1){
               for (let i = 0; i < res.length; i++) {
                  let site1= {} as SiteOrder;
                  site1= res[i];
                  siteArr.push(site1);
               }
            }
            else if(res.length==1)
            site = res[0];
            this.siteOrderList=[];
            if(res.length>1)
            this.siteOrderList= siteArr;
            else
             this.siteOrderList.push(site);
            break;
      
        case 4:
          let economy = {} as EconomyOrder;
          let ecoArr: EconomyOrder[]=[];
          if(res.length>1){
             for (let i = 0; i < res.length; i++) {
                let eco= {} as EconomyOrder;
                eco= res[i];
                ecoArr.push(eco);
             }

          }
          else if(res.length==1)
          economy = res[0]; 
          this.economyOrderList=[];
          if(res.length>1)
          this.economyOrderList= ecoArr;
          else
          this.economyOrderList.push(economy);

          if(operation=='adding' && isTempurary==true)
          this.updatetempOrderReduce(res,orderTypeId);
          break;
        case 6:
            let guidance = {} as GuidanceOrder;
            let guideArr: GuidanceOrder[]=[];
            if(res.length>1){
               for (let i = 0; i < res.length; i++) {
                  let guide= {} as GuidanceOrder;
                  guide= res[i];
                  guideArr.push(guide);
               }
            }
            else if(res.length==1)
            guidance = res[0]; 
            this.gudianceOrderList=[];
            if(res.length>1)
            this.gudianceOrderList= guideArr;
            else
             this.gudianceOrderList.push(guidance);
             if(operation=='adding' && isTempurary==true)
             this.updatetempOrderReduce(res,orderTypeId);
            break;
          case 7:
              let hosting = {} as HostingOrder;
              let hostArr: HostingOrder[]=[];
              if(res.length>1){
                 for (let i = 0; i < res.length; i++) {
                    let host= {} as HostingOrder;
                    host= res[i];
                    hostArr.push(host);
                 }
              }
              else if(res.length==1)
              hosting = res[0]; 
              this.hostingOrderList=[];
              if(res.length>1)
              this.hostingOrderList= hostArr;
              else
               this.hostingOrderList.push(hosting);
               if(operation=='adding' && isTempurary==true)
               this.updatetempOrderReduce(res,orderTypeId);
              break;
          case 10:
                let musicActivation = {} as MusicActivationOrder;
                let musicArr: MusicActivationOrder[]=[];
                if(res.length>1){
                   for (let i = 0; i < res.length; i++) {
                      let music= {} as MusicActivationOrder;
                      music= res[i];
                      musicArr.push(music);
                   }
                }
                else if(res.length==1)
                musicActivation = res[0]; 
                this.musicOrderList=[];
                if(res.length>1)
                this.musicOrderList= musicArr;
                else
                 this.musicOrderList.push(musicActivation);
                break;
    


    }
  }



  //     updatetempOrderReduce(res, orderTypeId){
  //     let temp= this.tempOrderReduce.value.tempOrderReduce;
  //     for (var i in temp[orderTypeId]) {
  //        let tempOrderId= res[i].globalParameters.tempOrderIdentity;
  //        if(temp[orderTypeId][i].orderTempId==tempOrderId){
  //         temp[orderTypeId][i].orderId= res[0].globalParameters.orderId;
  //         temp[orderTypeId][i].orderItemIdentity= res[0].globalParameters.itemOrderRecordId;
  //         temp[orderTypeId].splice(i, 1);
  //        }
  //     }
  //     //this.updateTempOrderReduce(temp);
  //     //this.updateTempOrderReduce(temp,orderTypeId);
     
  //   }
  //   this.updateTempOrderReduce(temp);
   
  // }



    updatetempOrderReduce(res, orderTypeId){
      let temp= this.tempOrderReduce.value.tempOrderReduce;
      for (var i in temp[orderTypeId]) {
        for(var j in res ){
          if(temp[orderTypeId][i].tempOrderId==res[j].globalParameters.tempOrderIdentity){
            temp[orderTypeId].splice(i, 1);
            break;


        }
        //  let tempOrderId= res[i].globalParameters.tempOrderIdentity;
        //  if(temp[orderTypeId][i].orderTempId==tempOrderId){
        //   //temp[orderTypeId][i].orderId= res[0].globalParameters.orderId;
        //   //temp[orderTypeId][i].orderItemIdentity= res[0].globalParameters.itemOrderRecordId;
        //   temp[orderTypeId].splice(i, 1);
        //  }
      }
    }

      //this.updateTempOrderReduce(temp)
      this.updateTempOrderReduce(temp,orderTypeId);
     // this.updateTempOrderReduce(temp);
  }



}
