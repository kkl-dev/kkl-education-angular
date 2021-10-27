import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { OrderService, TransportOrder, OrderEvent, EconomyOrder } from 'src/app/open-api';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GeneralFormService {
  supplierList = [];
  itemsList = [];
  public transportOrderList: TransportOrder[] = [];
  public economyOrderList: EconomyOrder[] =[];
  //centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
  constructor(private orderService: OrderService, private squadAssembleService: SquadAssembleService,  private _dialog: MatDialog) { }
  public details: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'supplier',
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
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'peopleInTrip',
      label: 'משתתפים',
      value: String(this.squadAssembleService.peopleInTrip),
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'itemCost',
      label: 'מחיר',
      value: '',
      type: 'number',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingSupplier',
      label: 'עלות ספק',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'billingCustomer',
      label: 'חיוב לקוח',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'total',
      label: 'סה"כ',
      value: '',
      validations: [Validators.required],
    }),

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
    // new QuestionTextbox({
    //   key: 'stabilizationLocation',
    //   label: 'מקום איסוף',
    //   value: '',
    //   icon: 'place',
    //   validations: [Validators.required],
    //   inputProps: {
    //     // labelSize: 's5',
    //   },
    // }),
    new QuestionTextbox({
      key: 'pickUpAddress',
      label: 'כתובת איסוף',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
    new QuestionTextbox({
      key: 'scatterAddress',
      label: 'כתובת פיזור',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),
  ]
  public economy: QuestionBase<string>[] = [
    // new QuestionTextbox({
    //   key: 'servingTime',
    //   label: 'שעת הגשה',
    //   value: '',
    //   icon: 'schedule',
    //   type: 'time',
    //   validations: [Validators.required],
    //   inputProps: {
    //     // labelSize: 's5',
    //   },
    // }),
    // new QuestionTextbox({
    //   key: 'location',
    //   label: 'מיקום',
    //   value: '',
    //   icon: 'place',
    //   validations: [Validators.required],
    //   inputProps: {
    //     // labelSize: 's5',
    //   },
    // }),
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


  //public tempDetails = this.details;

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
      control.value = data.globalParameters[control.key];
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


  // originalItemList = [];
  // getOrderItemBySupplierId() {
  //   let index = this.details.findIndex(el => el.key === "supplier");
  //   var supplierId = parseInt(this.details[index].value);
  //   this.orderService.getOrdersItemBySupplierID(supplierId, 1, false).subscribe(
  //     response => {
  //       console.log(response);
  //       this.originalItemList = response;
  //       response.forEach(element => {
  //         this.itemsList.push({ label: element.name, value: element.id.toString() });
  //       });
  //     },
  //     error => console.log(error),       // error
  //     () => console.log('completed')     // complete
  //   )
  // }


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



   addOrder(item: any,orderType) {  
      this.orderService.addOrder(4, item).subscribe(res => {
        console.log(res);
        this.addToOrderList(res,orderType);
      }, (err) => {
        console.log(err);
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
      })
    }

  
    addToOrderList(res, orderType){
      switch (orderType) {
        case 'היסעים':
            this.transportOrderList.push(res);
          break;
  
        case 'כלכלה':
          this.economyOrderList.push(res);
          break;
    }
  }

     


}
