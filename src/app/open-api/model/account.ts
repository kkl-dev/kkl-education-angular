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


export interface Account { 
    userId?: string;
    userInfo?: string;
    userInfoEng?: string;
    password?: string;
    email?: string;
    phone?: string;
    currentPermissionId?: number | null;
    currentPermissionName?: string;
    fromRegion?: number | null;
    toRegion?: number | null;
    isCanSendConfirmation?: number | null;
    centerFieldId?: number | null;
}

