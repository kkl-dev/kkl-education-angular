/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.10.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LodgingGISFacility } from './lodgingGISFacility';


/**
 * map object received from the server (for the GIS map)
 */
export interface FacilityMapByDates { 
    date?: string;
    lodgingFacilityList?: Array<LodgingGISFacility>;
}

