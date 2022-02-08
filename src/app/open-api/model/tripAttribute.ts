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


export interface TripAttribute { 
    id?: number;
    name?: string;
    budgetId?: number | null;
    budgetName?: string;
    /**
     * subsidization 1 to 25 ratio
     */
    subsidization1To25?: number | null;
    autoCustomerId?: number | null;
}

