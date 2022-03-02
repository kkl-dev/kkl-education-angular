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
import { AvailableFacility } from './availableFacility';


/**
 * Describes the availability of the facilities by date
 */
export interface FacilityDate { 
    date?: string;
    facilitiesList?: Array<AvailableFacility>;
}

