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


export interface AccommodationType { 
    /**
     * Accomodation Type Id
     */
    id: number;
    /**
     * Accomodation type name
     */
    name: string;
    /**
     * For compatibility reasons
     */
    nameEng?: string;
    /**
     * For compatibility reasons
     */
    img?: string;
    /**
     * max occupancy (beds) per one lodging place
     */
    maxOccupancy?: number;
    /**
     * num of units in fieldforestcenter
     */
    totalUnits?: number;
}

