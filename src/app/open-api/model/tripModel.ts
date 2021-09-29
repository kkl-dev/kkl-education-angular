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
import { TripInfo } from './tripInfo';
import { Movements } from './movements';
import { OrderModel } from './orderModel';


export interface TripModel { 
    trip?: TripInfo;
    orderList?: Array<OrderModel> | null;
    movementsList?: Array<Movements> | null;
}

