/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.3.0
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TripActivityLookup { 
    activityId?: number;
    name?: string;
    sitePicture?: string;
    linkToDetails?: string;
    description?: string;
    /**
     * activity by category
     */
    categoryId?: number | null;
    /**
     * activity by region
     */
    regionId?: number | null;
}

