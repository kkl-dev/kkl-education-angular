/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.7.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AccommodationType } from './accommodationType';


export interface FieldForestCenter { 
    /**
     * FieldForestCenter unique ID
     */
    id: number;
    /**
     * Field & Forest Center name
     */
    name: string;
    /**
     * yochai will check for path or base64
     */
    iconPath?: string;
    /**
     * list of available accomoadation types
     */
    accommodationList?: Array<AccommodationType>;
    diningRoomNotAvaliableFrom?: string;
    diningRoomNotAvaliableTill?: string | null;
    chevelCode?: number;
    /**
     * gg
     */
    linkSite?: string;
    isActive?: boolean | null;
}

