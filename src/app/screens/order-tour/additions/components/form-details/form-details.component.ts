import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { buildDayTableModel } from '@fullcalendar/daygrid';
import { BehaviorSubject } from 'rxjs';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
//import { transportColumns, details, summery, supplier } from 'src/mock_data/additions';
import { GeneralFormService } from '../../services/general-form.service';

// export const transportColumns: TableCellModel[] = [
export const orderColumns: TableCellModel[] = [
  {
    key: 'tourId',
    label: 'מספר טיול',
    value: '',
    rows: 1,
  },
  {
    key: 'supplier',
    label: 'ספק',
    rows: 3,
  },
  {
    key: 'tourDetails',
    label: 'קליטת טיול',
    rows: 2,
  },
];


export const details: TableCellModel[] = [
  {
    key: 'orderType',
    label: 'סוג',
    value: '',
  },
  {
    key: 'status',
    label: 'סטטוס',
    value: '',
  },
  {
    key: 'type',
    label: 'מספר הזמנת רכש',
    value: '',
  },
]

export const supplier: TableCellModel[] = [
  {
    key: 'name',
    label: 'שם הספק הנבחר',
    value: '',
  },
  {
    key: 'businessId',
    label: 'ע.מורשה',
    value: null,
  },
  {
    key: 'financelId',
    label: 'מ.ספק הפיננסית',
    value: null,
  },
  {
    key: 'address',
    label: 'כתובת',
    value: '',
  },
  {
    key: 'contact',
    label: 'איש קשר',
    value: '',
  },
  {
    key: 'phone',
    label: 'טלפון',
    value: '',
  },
  {
    key: 'fax',
    label: 'פקס',
    value: '',
  },
  {
    key: 'email',
    label: 'מייל',
    value: '',
  },
  {
    key: 'processId',
    label: 'איש קשר',
    value: '',
  },
  {
    key: 'aproveContact',
    label: 'הזמנה אושרה ע"י',
    value: '',
  },
  {
    key: 'aproveDate',
    label: 'תאריך אישור',
    type: 'date',
    value: '',
  },
  {
    key: 'aproveContactId',
    label: 'ת.ז מאשר',
    value: '',
  },
];

export const summery: TableCellModel[] = [
  {
    key: 'contact',
    label: 'נקלט ע"י',
    value: '',
  },
  {
    key: 'date',
    label: 'בתאריך',
    type: 'date',
    value: '',
  },
  {
    key: 'supplyDate',
    label: 'נשלח לספק',
    type: 'date',
    value: '',
  },
  {
    key: 'aproveDate',
    label: 'תאריך אישור',
    type: 'date',
    value: '',
  },
  {
    key: 'totalPrice',
    label: 'לתשלום',
    value: null,
  },
  {
    key: 'comments',
    label: 'הערה',
    value: '',
    cols: 2,
  },

]

export interface TableData {
  columns?: TableCellModel[];
  rows: TableCellModel[][];
}
@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.scss']
})

export class FormDetailsComponent implements OnInit {

  flag: boolean = false;
  @Input() public tableData: any;

  //public columns: TableCellModel[] = transportColumns;
  public columns: TableCellModel[] = orderColumns;


  public title: string = 'פרטים נוספים';
  public editMode: boolean = false;
  //public rows: TableCellModel[][] = [details1, supplier1, summery1];
  public rows: TableCellModel[][] = [details, supplier, summery];

  public detailsSubject = new BehaviorSubject<TableData>({
    columns: this.columns,
    rows: this.rows,
  });
  public data$ = this.detailsSubject.asObservable();
  //public data1$ = this.detailsSubject.asObservable();

  public cancellation: string = '';

  private cancelColumn: TableCellModel = {
    key: 'cancel',
    label: 'ביטול הזמנה',
  };
  private cancellationForm: TableCellModel[] = [
    {
      key: 'cancel',
      label: 'סיבת ביטול',
      type: 'custom',
      cols: 2,
    },
    {
      key: 'button',
      type: 'button',
      label: '',
      cols: 2,
    },
  ];
  private cancellationRow: TableCellModel[] = [
    {
      key: 'date',
      type: 'date',
      label: 'בוטל בתאריך',
      value: '',
    },
    {
      key: 'concat',
      label: 'בוטל ע"י',
      value: '',
    },
    {
      key: 'permission',
      label: '',
      value: '',
    },
    {
      key: 'contactId',
      label: 'ת.ז.',
      value: null,
    },
  ];
  constructor(private generalFormService: GeneralFormService) { }

  ngOnInit(): void {
    // this.generalFormService.tableData.subscribe(res=>{  
    //     this.setTableData(res);
    //     console.log('res from table data is :',res);
    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableData.currentValue != null && changes.tableData.currentValue != undefined) {
      console.log('changes is: ', changes.tableData.currentValue);
      this.setTableData(changes.tableData.currentValue);
    }
  }

  setTableData(res) {
   
    this.detailsSubject.value.columns[0].value= res[0].order.tripId;
    this.detailsSubject.value.rows[0][0].value= res[0].order.orderType.name
    this.detailsSubject.value.rows[0][1].value = res[0].order.status?res[0].order.status.name:'';
    this.detailsSubject.value.rows[1][0].value =  res[0].order.supplier.name;
     this.detailsSubject.value.rows[1][3].value = res[0].order.supplier.address;
    this.detailsSubject.value.rows[1][4].value = res[0].order.supplier.contact;
    this.detailsSubject.value.rows[1][5].value = res[0].order.supplier.phone;
    this.detailsSubject.value.rows[1][6].value = res[0].order.supplier.fax;
    this.detailsSubject.value.rows[1][7].value = res[0].order.supplier.email;
    this.detailsSubject.value.rows[1][9].value = res[0].order.userInfo;//הזמנה אושרה ע''י
    this.detailsSubject.value.rows[1][10].value = res[0].order.confirmDate;//תאריך אישור
    this.detailsSubject.value.rows[1][11].value = res[0].order.confirmUserTz;//ת.ז. מאשר
   this.flag=true;
  }

  public openCancelForm() {
    this.rows.push(this.cancellationForm);
    this.columns.push(this.cancelColumn);
    this.detailsSubject.next({ columns: this.columns, rows: this.rows });
    this.editMode = true;
  }

  public updateCancelForm() {

    const cancellation: TableCellModel = {
      key: 'cancel',
      label: 'סיבת ביטול',
      value: this.cancellation,
      cols: 3,
    };

    this.cancellationRow.push(cancellation)
    this.rows[this.rows.length - 1] = this.cancellationRow;
    this.detailsSubject.next({ columns: this.columns, rows: this.rows });
  }
}
