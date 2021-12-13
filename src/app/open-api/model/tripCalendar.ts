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
import { TempOrder } from './tempOrder';
import { TripActivity } from './tripActivity';


export interface TripCalendar { 
    tripId?: number;
    tempOrderList?: Array<TempOrder>;
    activityList?: Array<TripActivity>;
}

