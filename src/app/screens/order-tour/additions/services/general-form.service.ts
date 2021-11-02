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
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeneralFormService {
  supplierList = [];
  itemsList = [];
  public transportOrderList: TransportOrder[] = [];
  public economyOrderList: EconomyOrder[] =[];
  public gudianceOrderList : GuidanceOrder[]=[];
  public hostingOrderList : HostingOrder[] =[];
  public siteOrderList : SiteOrder[] =[];
  public securingOrderList: SecuringOrder[] =[];
  public musicOrderList: MusicActivationOrder[]=[];
  public settlementList=[];
  public languageList =[];
  tripOrdersList :OrderEvent[];
  public tempOrderReduce = new BehaviorSubject<any>(null)
  //centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
  constructor(private orderService: OrderService, private squadAssembleService: SquadAssembleService,  private _dialog: MatDialog,
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
      validations: [Validators.required],
      inputProps: {
        // options: [
        //   { label: 'יום 1', value: '1' },
        //   { label: 'יום 2', value: '2' },
        //   { label: 'יום 3', value: '3' },
        //   { label: 'יום 4', value: '4' },
        // ],
      },
    }),
    new QuestionSelect({
      key: 'endDate',
      icon: 'date_range',
      label: 'תאריך פיזור',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        // options: [
        //   { label: 'יום 1', value: '1' },
        //   { label: 'יום 2', value: '2' },
        //   { label: 'יום 3', value: '3' },
        //   { label: 'יום 4', value: '4' },
        // ],
      },
    }),
    new QuestionTextbox({
      key: 'startHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
      // inputProps: {
      //   // labelSize: 's5',
      // },
    }),

    new QuestionTextbox({
      key: 'endHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'location',
      label: 'מיקום',
      value: '',
      icon: 'place',
      validations: [Validators.required],
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
      offset: 1,
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
      key: 'exitLocation',
      label: 'נקודת יציאה',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options :this.settlementList
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
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'veganDishesNumber',
      label: 'מספר מנות טבעוניות',
      value: '',
      validations: [Validators.required],
    }),
  ]

  public guidance: QuestionBase<string>[] = [
   
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
    new QuestionTextbox({
      key: 'guideName',
      label: 'שם המדריך',
      value: '',
      validations: [Validators.required],
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
      validations: [Validators.required],
    }),
  ]

  public site: QuestionBase<string>[] = [
   
    new QuestionSelect({
      key: 'siteCode',
      label: 'בחר אתר',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
      
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
    new QuestionSelect({
      key: 'isCustomerOrder',
      label: 'האם הלקוח מזמין',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
      
      },
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
      hasButton: true,
      cols: 8,
    },
  ];

  public setInitialValues(
    questions: QuestionBase<string | number | Date | QuestionGroup>[],
    data: any
  ) {
    questions.map((control: QuestionBase<string | number | Date | QuestionGroup>) => {
      // control.value = data[control.key]
      let startDate =data.globalParameters.startDate;
      let endDate = data.globalParameters.endDate;
      control.value = data.globalParameters[control.key];
      if(control.key=='peopleInTrip'){
        control.value=this.squadAssembleService.peopleInTrip;
      }
      if(control.key=='startHour' && data.globalParameters[control.key].includes('T')){
        control.value= this.setTimeFormat(data.globalParameters[control.key]);
      }
      if(control.key=='endHour' && data.globalParameters[control.key].includes('T')){
        control.value= this.setTimeFormat(data.globalParameters[control.key]);
      }
      if(control.key=='startDate' && (data.globalParameters[control.key]).includes('T')){
        control.value= this.changeDateFormat(data.globalParameters[control.key],'israel');
      }
      if(control.key=='endDate' &&  (data.globalParameters[control.key]).includes('T')){
        control.value= this.changeDateFormat(data.globalParameters[control.key],'israel');
      }
      if(control.key=='quantity' &&  data.globalParameters[control.key]==undefined){
        control.value= '1';
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

  public updateTempOrderReduce(temp) {
    this.tempOrderReduce.next(temp);
  }

  public setFormValues(data: any) {
    this.questionGroups.map((group: QuestionGroup) => {
      this.setInitialValues(group.questions, data);
    });
  }

  setDatesValues() {
    let tripDetails = this.squadAssembleService.tripInfofromService.trip;
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
      const newDateString = `${newDate.getDate()}/${(newDate.getMonth() + 1).toString()
        }/${newDate.getFullYear()}`;
      // const newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString()
      //   }-${newDate.getDate()}`;

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


  // getSupplierList(orderTypeId,tripId,orderId) {
  //   this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
  //     response => {
  //       console.log(response)
  //       response.forEach(element => {
  //         this.supplierList.push({ label: element.name, value: element.id.toString() });
  //       });
  //       this.getSupplierByOrderType(orderTypeId);
  //     },
  //     error => console.log(error),       // error
  //     () => console.log('completed')     // complete
  //   )
  // }

  // getSupplierByOrderType(orderTypeId) {
  //   this.orderService.getSupplierByOrderType(orderTypeId,1, 4).subscribe(
  //     response => {
  //       console.log(response);
  //       let index = this.details.findIndex(el => el.key === "supplier");
  //       this.details[index].value = response.id.toString();
  //     },
  //     error => console.log(error),       // error
  //     () => console.log('completed')     // complete
  //   )
   
  // }


  originalItemList = [];
  getOrderItemBySupplierId(supplierId) {
    this.orderService.getOrdersItemBySupplierID(supplierId, 1, false).subscribe(
      response => {
        console.log(response);
        this.itemsList=[];
        this.originalItemList = response;
        response.forEach(element => {
          this.itemsList.push({ label: element.name, value: element.id.toString() });
        });
        let index= this.details.findIndex(i => i.key==='itemId');
        this.details[index].inputProps.options= this.itemsList;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  setTimeFormat(hour){
    let hourStr= hour.split("T");
    let hourFormat= hourStr[1];
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

  clearFormFields(){
    let statHourIndex =this.details.findIndex(i => i.key==='startHour');
    this.details[statHourIndex].value='';
    let endHourIndex = this.details.findIndex(i => i.key==='endHour');
    this.details[endHourIndex].value='';
    let quantityIndex= this.details.findIndex(i => i.key==='quantity');
    this.details[quantityIndex].value='1';
    let itemCostIndex= this.details.findIndex(i => i.key==='itemCost');
    this.details[itemCostIndex].value='';
    let billingSupplierIndex= this.details.findIndex(i => i.key==='billingSupplier');
    this.details[billingSupplierIndex].value='';
    let billingCustomerIndex= this.details.findIndex(i => i.key==='billingCustomer');
    this.details[billingCustomerIndex].value='';
    let locationIndex= this.details.findIndex(i => i.key==='location');
    this.details[locationIndex].value='';
     this.comments[0].value='';
  }


    mapOrderList(orderList){
       console.log('order list is: ',orderList);
       orderList.forEach(element => {
         if (element.order.orderType.id==1){
           this.transportOrderList.push(element)
         }
         if (element.order.orderType.id==2){
          this.securingOrderList.push(element)
        }
         if (element.order.orderType.id==3){
          this.siteOrderList.push(element)
        }
        if (element.order.orderType.id==4){
          this.economyOrderList.push(element)
        }
        if (element.order.orderType.id==6){
          this.gudianceOrderList.push(element)
        }
        if (element.order.orderType.id==7){
          this.hostingOrderList.push(element)
        }
        if (element.order.orderType.id==10){
          this.musicOrderList.push(element)
        }
       });
    }

   addOrder(item: any,orderType) {  
      this.orderService.addOrder(4, item).subscribe(res => {
        console.log(res);  
        this.addToOrderList(res,orderType);
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'ההזמנה נשמרה בהצלחה', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
      }, (err) => {
        console.log(err);
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
      })
    }

  
    addToOrderList(res, orderTypeId){
      switch (orderTypeId) {
        case 1:
          let t = {} as TransportOrder;
          t.globalParameters = {} as OrderItemCommonDetails;
          t.order = {} as Order;
          t.order=res[0].order;
          t.globalParameters= res[0].globalParameters;
          // if(res[0].exitPoint)
          // t.exitPoint= res[0].exitPoint;
          // if(res[0].scatterLocation)
          //  t.scatterLocation= res[0].scatterLocation;
           this.transportOrderList.push(t);
           this.updatetempOrderReduce(res,orderTypeId);
          break;
        case 3:
            let site = {} as SiteOrder;
            site.globalParameters = {} as OrderItemCommonDetails;
            site.order = {} as Order;
            site.order=res[0].order;
            site.globalParameters= res[0].globalParameters;
             this.transportOrderList.push(site);
            break;
      
        case 4:
          let eco = {} as EconomyOrder;
          eco.globalParameters = {} as OrderItemCommonDetails;
          eco.order = {} as Order;
          eco.order=res[0].order;
          eco.globalParameters= res[0].globalParameters;
          this.economyOrderList.push(eco);
          this.updatetempOrderReduce(res,orderTypeId);
          break;
          case 6:
            let guidance = {} as GuidanceOrder;
            guidance.globalParameters = {} as OrderItemCommonDetails;
            guidance.order = {} as Order;
            guidance.order=res[0].order;
            guidance.globalParameters= res[0].globalParameters;
             this.gudianceOrderList.push(guidance);
             this.updatetempOrderReduce(res,orderTypeId);
            break;
          case 7:
              let hosting = {} as HostingOrder;
              hosting.globalParameters = {} as OrderItemCommonDetails;
              hosting.order = {} as Order;
              hosting.order=res[0].order;
              hosting.globalParameters= res[0].globalParameters;
               this.gudianceOrderList.push(hosting);
               this.updatetempOrderReduce(res,orderTypeId);
              break;
    
    }
  }


      updatetempOrderReduce(res, orderTypeId){
      let temp= this.tempOrderReduce.value;
      for (var i in temp[orderTypeId]) {
         let tempOrderId= res[0].globalParameters.tempOrderIdentity;
         if(temp[orderTypeId][i].orderTempId==tempOrderId){
          temp[orderTypeId][i].orderId= res[0].globalParameters.orderId;
          temp[orderTypeId][i].orderItemIdentity= res[0].globalParameters.itemOrderRecordId
         }
      }
      this.updateTempOrderReduce(temp);

    }

     


}
