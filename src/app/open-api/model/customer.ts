/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.6.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BaseCustomer } from './baseCustomer';


export interface Customer extends BaseCustomer { 
    typeId?: number;
    typeName?: string;
    identificationTypeId?: number | null;
    idCode?: number | null;
    provinceId?: number | null;
    countryId?: number | null;
    countryName?: string;
    regionId?: number | null;
    regionName?: string;
    cityIdHebName?: string;
    streetNameHeb?: string;
    zipId?: number | null;
    phone?: string;
    phoneWorks?: string;
    fax?: string;
    email?: string;
    userInfo?: string;
    generateDate?: string | null;
    appId?: number | null;
    noPayment?: number | null;
    internalCustomer?: number | null;
}

