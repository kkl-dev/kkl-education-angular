/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.4.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SleepingOptions } from './sleepingOptions';


/**
 * Available sleeping options by Day and maximum occupancy.
 */
export interface AvailableSleepingOptionsByDay { 
    date?: string;
    sleepingOptions?: Array<SleepingOptions>;
}

