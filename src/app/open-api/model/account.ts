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


export interface Account { 
    userId?: string;
    userName?: string | null;
    userNameEng?: string | null;
    password?: string;
    email?: string | null;
    phone?: string | null;
    currentPermissionId?: number | null;
    currentPermissionName?: string | null;
    fromRegion?: number | null;
    toRegion?: number | null;
    isCanSendConfirmation?: number | null;
    centerFieldId?: number | null;
}
