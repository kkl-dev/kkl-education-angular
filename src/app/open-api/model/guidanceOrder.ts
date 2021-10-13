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
import { Order } from './order';
import { OrderItemCommonDetails } from './orderItemCommonDetails';
import { OrderEvent } from './orderEvent';


export interface GuidanceOrder extends OrderEvent { 
    location?: string;
    guideName?: string;
    languageGide?: string;
    guideInstructions?: string;
}

