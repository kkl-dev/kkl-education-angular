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
import { TripAttribute } from './tripAttribute';
import { ActivityType } from './activityType';
import { Budget } from './budget';


export interface BudgetByParams { 
    tripStart?: string;
    attribute: TripAttribute;
    activity?: ActivityType;
    budget?: Budget;
    userName: string;
    userId: string;
    tripId?: number | null;
}
