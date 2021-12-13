/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.8.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Status } from './status';
import { OrderType } from './orderType';
import { Supplier } from './supplier';


export interface Order { 
    tripId?: number;
    orderId?: number;
    status?: Status;
    orderType?: OrderType;
    supplier?: Supplier;
    comment?: string;
    siteId?: number | null;
    sentToSupplier?: string | null;
    sentBy?: string;
    voucherNum?: number | null;
    cancelDate?: string | null;
    causeCancellation?: string;
    cancelBy?: string;
    paidToSupplier?: number | null;
    openDate?: string | null;
    finOrderType?: string;
    budgetItem?: number | null;
    confirmDate?: string | null;
    confirmBy?: string;
    confirmUserTz?: number | null;
    confirmByUser?: string;
    confirmCancelBy?: string;
    confirmCancelByUser?: string;
    confirmCancelDate?: string | null;
    confirmCancelUserTz?: number | null;
    supplierProcedureNum?: string;
    totalPayCustomer?: number | null;
    totalPaySupplier?: number | null;
    totalPayAfterKklSubsidy?: number | null;
    userInfo?: string;
}

