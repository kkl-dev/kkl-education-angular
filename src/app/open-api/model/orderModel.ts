/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.1.0
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Order } from './order';
import { OrderItem } from './orderItem';


export interface OrderModel { 
    order?: Order;
    listItems?: Array<OrderItem> | null;
    totalPayCustomer?: number | null;
    totalPaySupplier?: number | null;
    totalPayAfterKklSubsidy?: number | null;
}

