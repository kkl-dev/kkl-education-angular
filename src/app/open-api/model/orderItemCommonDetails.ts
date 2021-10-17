/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.2.0
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ItemsByTypeOrder } from './itemsByTypeOrder';


export interface OrderItemCommonDetails { 
    itemId?: number;
    /**
     * refers to indentity record on data base
     */
    itemIdentity?: number;
    orderItemDetails?: ItemsByTypeOrder;
    quantity?: number;
    itemCost?: number;
    billingSupplier?: number | null;
    billingCustomer?: number | null;
    peopleInTrip?: number | null;
    startDate?: string;
    endDate?: string;
    startHour?: string;
    endHour?: string;
    userName?: string;
    comment?: string;
}

