/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.5.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ItemsByTypeOrder { 
    id?: number;
    name?: string;
    cost?: number;
    title?: string;
    type?: number;
    costCustomer?: number;
    costSupplier?: number;
    numPeople?: number;
    cosherType?: number;
    credit?: number | null;
    costVat?: number | null;
    isCustomerBilling?: number | null;
    isNight?: number | null;
    orderType?: number | null;
    isSumPeopleOrAmount?: number | null;
    groupTypeId?: number | null;
    weekPart?: string;
    typeSleepId?: number | null;
    customerId?: string | null;
    supplierId?: number | null;
    classroomTypeId?: number | null;
    isSmallRange?: number | null;
    amountLimit?: number | null;
    participantsLimit?: number | null;
    numSeat?: number | null;
    isMore?: number | null;
    listNamesClasses?: Array<string>;
    isNeedManagerApproval?: boolean;
}

