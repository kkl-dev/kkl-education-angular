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
import { AccommodationType } from './accommodationType';
import { ParticipantType } from './participantType';


export interface LodgingDetailsPerDay { 
    accomodationType?: AccommodationType;
    participant?: ParticipantType;
    lodgersNumber?: number;
    unitsNumber?: number;
    comments?: string;
}

