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


export interface SleepingOptions { 
    accomodationTypeId?: number;
    acoomodationTypeName?: string;
    /**
     * Maximum per lodging unit.
     */
    maxOccupancy?: number | null;
    /**
     * Number of avaliable lodging units (not beds!) for a day
     */
    availableUnits?: number;
    nameEng?: string;
    img?: string;
}

