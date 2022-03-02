/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.12.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TempOrder { 
    tempOrderId?: number | null;
    tripId?: number;
    orderTypeCode?: number;
    orderTypeName?: string;
    orderId?: number | null;
    /**
     * refers to identity of item index on the order table
     */
    orderItemIdentity?: number | null;
    /**
     * the unique item order id;
     */
    itemId?: number | null;
    orderItemName?: string;
    startDate?: string;
    endDate?: string;
    fromHour?: string;
    tillHour?: string;
}

