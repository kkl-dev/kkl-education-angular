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
import { Order } from './order';
import { OrderItemCommonDetails } from './orderItemCommonDetails';
import { OrderEvent } from './orderEvent';


export interface EconomyOrder extends OrderEvent { 
    regularDishesNumber?: number;
    vegetarianDishesNumber?: number | null;
    veganDishesNumber?: number | null;
}

