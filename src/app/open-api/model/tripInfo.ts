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
import { Status } from './status';
import { Area } from './area';
import { BaseCustomer } from './baseCustomer';
import { Language } from './language';
import { AgeGroup } from './ageGroup';
import { FieldForestCenter } from './fieldForestCenter';
import { LodgingReservation } from './lodgingReservation';
import { TripAttribute } from './tripAttribute';
import { ActivityType } from './activityType';
import { Country } from './country';
import { Budget } from './budget';


export interface TripInfo { 
    id?: number | null;
    tripDescription: string;
    tripStart: string;
    tripEnding: string;
    centerField: FieldForestCenter;
    activity: ActivityType;
    ageGroup: AgeGroup;
    attribute: TripAttribute;
    areaTrip?: Area;
    budget?: Budget;
    customer: BaseCustomer;
    kklWorkerId?: number;
    kklWorkerName?: string;
    customerPay?: BaseCustomer;
    commentManager?: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    confirm?: string;
    customerSignatureDate?: string | null;
    confirmBy?: string;
    country?: Country;
    /**
     * 1= Israel, 8= Abroad
     */
    departmentId: number;
    lodgingReservation?: Array<LodgingReservation>;
    /**
     * Trip creation date
     */
    generateTime?: string;
    language?: Language;
    numAccompanied?: number;
    numAdultAndYoung: number;
    numAccompaniedAndGuide?: number;
    numGuides?: number;
    numDrivers?: number;
    numShtilim?: number;
    noPayment?: number | null;
    tripStatus?: Status;
    userMobile?: string;
    userId?: string;
    userName: string;
    reasonUnConfirm?: string;
    /**
     * 1=Inside center, 2=Outside center
     */
    insideCenterFieldId: number;
    addressCasualCustomer?: string;
    cityCasualCustomer?: string;
    zipCasualCustomer?: number | null;
    phoneCasualCustomer?: string;
    nameCasualCustomer?: string;
    isSalKKlGroup?: number | null;
    isOccupancyProblematic?: number | null;
}

