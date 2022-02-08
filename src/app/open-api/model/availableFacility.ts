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
import { OccupiedHours } from './occupiedHours';


/**
 * decribes ...
 */
export interface AvailableFacility { 
    /**
     * Field-Forest-Center Facility Id
     */
    id: number;
    /**
     * Facility name
     */
    name: string;
    /**
     * rerer
     */
    maxOccupancy?: number;
    iconPath?: string;
    occupiedHours?: Array<OccupiedHours>;
}

