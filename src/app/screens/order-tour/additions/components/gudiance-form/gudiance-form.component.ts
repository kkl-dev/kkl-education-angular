import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { GuidanceOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-gudiance-form',
  templateUrl: './gudiance-form.component.html',
  styleUrls: ['./gudiance-form.component.scss']
})
export class GudianceFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService,
    private userService: UserService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;

  @Input() orderType: number;
  tripId: number;
  supplierId: number;
  itemId: number;
  centerFieldId: number;
  originalItemList = [];
  itemsList =[]
  supplierListSub: Subscription;
  supplierSub: Subscription;
  itemListSub:  Subscription;
  languageSub: Subscription;
  flag: boolean =false;
  isEditable : boolean= false;

  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableDataSub: Subscription;
  tableData: any;
  isItemOrderExist: boolean;
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {
   
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.centerFieldId= this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.itemsList = []
    let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;

    this.setformTemplate();

    if (this.item != undefined && this.item != null ) {
      if(this.item.globalParameters.supplierId!= undefined){
        this.editMode=true;
        this.supplierId= this.item.globalParameters.supplierId;
        this.itemId= this.item.globalParameters.itemId;
        //this.generalFormService.getOrderItemBySupplierId(this.supplierId);

      }
     // this.generalFormService.setFormValues(this.item);
    }

    else{
      let peopleInTripIndex= this.generalFormService.details.findIndex(i => i.key==='peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value= this.squadAssembleService.peopleInTrip;
    }
    this.getSupplierList(this.orderType, this.tripId, 0); 
    this.getLanguages();
    this.generalFormService.setDatesValues();
    this.tableDataSub=this.generalFormService.tableData.subscribe(res=>{
      console.log('res from table data intransort is :',res);
      this.tableData=res;
      this.ifShowtable=true;
    })

  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    //let detailsArr = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let guideQuestions = detailsArr.concat(this.generalFormService.guidance);
    this.generalFormService.questionGroups[index].questions = guideQuestions;
    //this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);
    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת התייצבות';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת פיזור';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'מקום התייצבות';
    return tempArr;
  }

  initiateForm(){
    this.flag=true;
    this.formTemplate.questionsGroups= this.generalFormService.questionGroups;
     console.log('this.formTemplate.questionsGroups:',this.formTemplate.questionsGroups)
  }

  displayTable(){
    let transArr= this.generalFormService.gudianceOrderList;
    let currentObj= transArr.find(i=> (i.globalParameters.itemOrderRecordId)=== (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId)=== (this.item.globalParameters.supplierId) );
    let arr=[]
    arr.push(currentObj);
    this.tableData=arr;
    this.ifShowtable=true;

 }

  getSupplierList(orderTypeId, tripId, orderId) {

    this.supplierListSub=this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(

      response => {
        console.log(response);
        this.generalFormService.supplierList = [];
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
         let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
         this.generalFormService.details[supplierIndex].inputProps.options = this.generalFormService.supplierList;
         if(this.supplierId== undefined)
           this.getSupplierByOrderType();
           else{
            this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
            this.getOrderItemBySupplierId()
           }
           
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getSupplierByOrderType() {
    // let centerFieldId 
    // if(this.squadAssembleService.tripInfofromService ! = undefined){
    //    centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
    // }  
    // else{
    //   let retrievedObject = localStorage.getItem('tripInfofromService');
    //   let retrievedObj = JSON.parse(retrievedObject);
    //   centerFieldId= retrievedObj.trip.centerField.id;
    // }
    
    this.supplierSub= this.orderService.getSupplierByOrderType(this.orderType,this.centerFieldId).subscribe(
      response => {
        console.log(response);
        this.supplierId= response.id;
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
         this.getOrderItemBySupplierId();

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }


  
  getOrderItemBySupplierId() {
    this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, false).subscribe(
      response => {
        console.log(response);
        this.itemsList=[];
        this.originalItemList = response;
        this.generalFormService.originalItemList=response;
        response.forEach(element => {
          this.itemsList.push({ label: element.name, value: element.id.toString() });
        });
        let itemIndex= this.generalFormService.details.findIndex(i => i.key==='itemId');
        this.generalFormService.details[itemIndex].inputProps.options= this.itemsList;
        if(this.itemId!= undefined)
        this.generalFormService.details[itemIndex].value= this.itemId.toString();
        if (this.item != undefined && this.item != null ) {
            this.item.globalParameters.supplierId=this.supplierId.toString();
            if(this.item.globalParameters.orderId)
            this.isItemOrderExist=true;
            this.generalFormService.setFormValues(this.item, this.isItemOrderExist);
        }
        this.initiateForm();
        if (this.item != undefined && this.item != null) {
          if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.itemId!= undefined)
           this.displayTable();
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getLanguages(){
     this.languageSub= this.userService.getLanguages().subscribe(res=>{
        console.log(res);
        res.forEach(element =>{
          this.generalFormService.languageList.push({label:element.name,value :element.id}); 
        })
        let languageIndex= this.generalFormService.details.findIndex(i => i.key==='languageGuidance');
        this.generalFormService.details[languageIndex].inputProps.options= this.generalFormService.languageList;
     },(err)=>{

      console.log(err);
    })
  }


  public onSave(): void {
    if (this.form) {
      //if (!this.additionsService.globalValidations(this.form)) { return; }
     //if (!this.validationsGudiance()) { return; }
      this.editMode = true;
      let orderId;
      if (this.generalFormService.economyOrderList.length > 0) {
        orderId = this.generalFormService.economyOrderList[0].order.orderId
      }
      let guide = {} as GuidanceOrder;
      guide.globalParameters = {} as OrderItemCommonDetails;
      guide.order = {} as Order;
      guide.order.orderId = orderId;
      guide.order.supplier = {} as Supplier;
      guide.order.orderType = {} as OrderType;
      Object.keys(this.form.getRawValue().details).map((key, index) => {
        if (key !== 'scatterLocation' && key !== 'guideName' && key !== 'languageGuidance' && key !== 'guideInstructions') {
          if (key != 'startDate' && key != 'endDate') {
            guide.globalParameters[key] = this.form.getRawValue().details[key]
          } else {
            if (key == 'startDate') {
              guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
            }
            if (key == 'endDate') {
              guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
            }
          }
        }
        else {
          guide.scatterLocation= this.form.getRawValue().details['scatterLocation'];
          guide.guideName=  this.form.getRawValue().details['guideName'];
          guide.languageGuidance= this.form.getRawValue().details['languageGuidance'];
          guide.guideInstructions= this.form.getRawValue().details['guideInstructions'];
        }

      });
      guide.globalParameters['startHour'] = this.setDateTimeFormat(guide.globalParameters.startDate, guide.globalParameters.startHour);
      guide.globalParameters['endHour'] = this.setDateTimeFormat(guide.globalParameters.endDate, guide.globalParameters.endHour);
      guide.globalParameters['comments'] = this.form.getRawValue().comments.comments;
      guide.globalParameters.orderId = orderId;
      guide.order.supplier.id = +this.form.getRawValue().details.supplierId;
      guide.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      guide.order.orderType.name = 'הדרכה';
      guide.order.orderType.id = 6;
      if(this.item!= undefined){
        if (this.item.globalParameters.tempOrderIdentity != undefined)
        guide.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
      }
    
      if(!this.isEditable)
      this.generalFormService.addOrder(guide, guide.order.orderType.id);
      else{
        guide.globalParameters.itemOrderRecordId= this.item.globalParameters.itemOrderRecordId;
        this.generalFormService.editOrder(guide, guide.order.orderType.id);
      }
     
      this.form.disable({ emitEvent: false });
    }
  }
  validationsGudiance() {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (item.credit === 0) {
      if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת הדרכה - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת הדרכה - חובה למלא מקום התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }

    }
    // chani

    // אם הפריט הוא תוספת ריכוז חובה להכניס הערה
    if (item.itemId == 234) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'חובה למלא הערה בפריט - תןוספת ריכוז', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    // הרד קודד - צריך עדכון DB
    // אם הפריט הוא ריכוז מחנה וגם הטיול חוץ מרכז שדה לא לאפשר לשבץ מדריך לפריט זה
    if ((item.itemId == 25 || item.itemId == 152 || item.itemId == 218 ||
      item.itemId == 219 || item.itemId == 229 || item.itemId == 235 || item.itemId == 271)
      && this.squadAssembleService.tripInfofromService.trip.insideCenterFieldId == 2) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'לא ניתן לשבץ מדריך לטיול שהוא חוץ מרכז שדה בפריט ריכוז מחנה', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    // צריך טיפול בהרשאות- בינתיים , מתייחסים להרשאה כהרשאה קבועה - משווק
    // צריך תנאי האם ההרשאה היא אכן משווק
    // אם הפריט זיכוי (וההרשאה משווק)
    if (item.credit == 1) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'פריט מסוג זיכוי מצריך אישור חשב', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    // חסר בYAML צריך להוסיך את השדה הזה
    // אם הפריט מצריך אישור של מנהל מחלקה וגם אם הוא מסוג זיכוי
    // if (item.need_att_manager_approval == 1) {
    //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //     width: '500px',
    //     data: { message: 'פריט  מצריך אישור מנהל מחלקה', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
    //   })
    //   return false;
    // }

    // לא לכל ההרשאות
    if (item.itemId = 220) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'אין לך הרשאה לקלוט פריט זה', content: '', }
      })
      return false;
    }

    // בדיקה שהפריט שישי שבת
    // או חג
    if (item.itemId == 219) {
      if (item.startDate.getDay() != 6 || item.endDate.getDay() != 7) {
        // בדיקה שזה לא יוצא חג- ואם כן שאלה האם להמשיך , צריך לברר מול חיה
        if (this.isHoliday()) {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: ' ', content: '', }
          })
        }
        else {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: '"פריט זה לא מתאים לתאריכי הטיול" ', content: '', }
          })
          return false;
        }
      }
    }

    // אין להוסיף פריטים "תוספת לינה" ו"תוספת פעילות לילה" (419, 177) לאותו לילה בטיול
    // צרך בדיקה אם זה אכן מבצע את הבדיקה הזאת בצורה נכונה
    if (item.itemId == 117 || item.itemId == 419) {
      if (this.generalFormService.guidance.filter(x => x["itemId"].itemId == item.itemId &&
        x["startDate"].getDate() == item.startDate &&
        x["startDate"].getDate() < item.endDate) != null) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: "אין להזין את הפריטים: תוספת לינת לילה ותוספת פעילות לילה לאותו לילה בטיול", content: '', }
        })
        return false;
      }
    }
    return true;
  }

   // chani- from PB
  // צריך להיות כללי
  isHoliday() {
    // var hebrewDate = require("hebrew-date");
    // console.log(hebrewDate(2016, 10, 2));

    // רשימה של חגים בלוח השנה העברי
    // מחזיר האם
    return true;
  }

  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  public onEdit() {
    console.log('I am edit');
    this.editMode = false;
    this.isEditable=true;
    this.form.enable({ emitEvent: false });
  }

  public onValueChange(event) {
    this.form = event;

    console.log('I am form Event');
    this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
    this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log('supplier changed:',value);
        this.supplierId=value;
        this.getOrderItemBySupplierId();
      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let item = this.originalItemList.find(el => el.id === parseInt(value))
      let itemCost = Math.floor(item.cost);
      this.form.controls["details"].get('itemCost').setValue(itemCost,{emitEvent: false });
      console.log(this.form.value.details);
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier,{emitEvent: false});
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer,{emitEvent: false});

    });

    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier,{emitEvent: false});
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer,{emitEvent: false});

    });
    this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    console.log(this.form)

  }

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
  }
}
