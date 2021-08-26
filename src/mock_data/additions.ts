import { TableCellModel } from 'src/app/utilities/models/TableCell';

export const columns: TableCellModel[] = [
  {
    key: 'tourId',
    label: 'מספר טיול',
    value: '213232',
    offset: 1,
  },
  {
    key: 'supplier',
    label: 'ספק',
    offset: 3,
  },
  {
    key: 'tourDetails',
    label: 'קליטת טיול',
    offset: 2,
  },
];

export const details: TableCellModel[] = [
  {
    key: 'type',
    label: 'סוג',
    value: 'היסעים',
  },
  {
    key: 'status',
    label: 'סטטוס',
    value: 'חדש',
  },
  {
    key: 'type',
    label: 'מספר הזמנת רכש',
    value: 'חדש',
    divider: true,
  },
].reverse();

export const supplier: TableCellModel[] = [
  {
    key: 'name',
    label: 'שם הספק הנבחר',
    value: 'יפעת הסעות בע"מ',
  },
  {
    key: 'businessId',
    label: 'ע.מורשה',
    value: 5500,
  },
  {
    key: 'financelId',
    label: 'מ.ספק הפיננסית',
    value: 39203923,
  },
  {
    key: 'address',
    label: 'כתובת',
    value: 'רחובות',
  },
  {
    key: 'contact',
    label: 'איש קשר',
    value: 'שחר גל',
  },
  {
    key: 'phone',
    label: 'טלפון',
    value: '04-43894389',
  },
  {
    key: 'fax',
    label: 'פקס',
    value: '04-43894389',
  },
  {
    key: 'email',
    label: 'מייל',
    value: 'dsds@ewew.com',
  },
  {
    key: 'processId',
    label: 'איש קשר',
    value: 'שחר גל',
  },
  {
    key: 'aproveContact',
    label: 'הזמנה אושרה ע"י',
    value: '323237823',
  },
  {
    key: 'aproveDate',
    label: 'תאריך אישור',
    type: 'date',
    value: new Date(),
  },
  {
    key: 'aproveContactId',
    label: 'ת.ז מאשר',
    value: '382938293',
    divider: true,
  },
];

export const summery : TableCellModel[] = [
  {
    key: 'contact',
    label: 'נקלט ע"י',
    value: 'שחר גל',
  },
  {
    key: 'date',
    label: 'בתאריך',
    type: 'date',
    value: new Date(),
  },
  {
    key: 'supplyDate',
    label: 'נשלח לספק',
    type: 'date',
    value: new Date(),
  },
  {
    key: 'aproveDate',
    label: 'תאריך אישור',
    type: 'date',
    value: new Date(),
  },
  {
    key: 'totalPrice',
    label: 'לתשלום',
    value: 5500,
  },
  {
    key: 'comments',
    label: 'הערה',
    value: 'לברר פרטים סופיים לגבי כמות אוטובוסים',
    divider: true,
  },

]

