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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { ItemsByTypeOrder } from '../model/models';
import { OrderItem } from '../model/models';
import { OrderModel } from '../model/models';
import { OrderType } from '../model/models';
import { Status } from '../model/models';
import { Supplier } from '../model/models';
import { TempOrder } from '../model/models';
import { TripModel } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

    protected basePath = 'https://virtserver.swaggerhub.com/shivek/kkl-education/1.1.0';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param userName 
     * @param permissionId 
     * @param isOccupancyProblemFromSp 
     * @param ibRemoveOccProb 
     * @param orderModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addOrder(userName: string, permissionId: number, isOccupancyProblemFromSp: string, ibRemoveOccProb: number, orderModel?: OrderModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<TripModel>;
    public addOrder(userName: string, permissionId: number, isOccupancyProblemFromSp: string, ibRemoveOccProb: number, orderModel?: OrderModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<TripModel>>;
    public addOrder(userName: string, permissionId: number, isOccupancyProblemFromSp: string, ibRemoveOccProb: number, orderModel?: OrderModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<TripModel>>;
    public addOrder(userName: string, permissionId: number, isOccupancyProblemFromSp: string, ibRemoveOccProb: number, orderModel?: OrderModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling addOrder.');
        }
        if (permissionId === null || permissionId === undefined) {
            throw new Error('Required parameter permissionId was null or undefined when calling addOrder.');
        }
        if (isOccupancyProblemFromSp === null || isOccupancyProblemFromSp === undefined) {
            throw new Error('Required parameter isOccupancyProblemFromSp was null or undefined when calling addOrder.');
        }
        if (ibRemoveOccProb === null || ibRemoveOccProb === undefined) {
            throw new Error('Required parameter ibRemoveOccProb was null or undefined when calling addOrder.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<TripModel>(`${this.configuration.basePath}/Order/AddOrder/${encodeURIComponent(String(userName))}/${encodeURIComponent(String(permissionId))}/${encodeURIComponent(String(isOccupancyProblemFromSp))}/${encodeURIComponent(String(ibRemoveOccProb))}`,
            orderModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param tripId 
     * @param orderId 
     * @param cause 
     * @param userName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public cancelOrder(tripId: number, orderId: number, cause: string, userName: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Status>;
    public cancelOrder(tripId: number, orderId: number, cause: string, userName: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Status>>;
    public cancelOrder(tripId: number, orderId: number, cause: string, userName: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Status>>;
    public cancelOrder(tripId: number, orderId: number, cause: string, userName: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling cancelOrder.');
        }
        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling cancelOrder.');
        }
        if (cause === null || cause === undefined) {
            throw new Error('Required parameter cause was null or undefined when calling cancelOrder.');
        }
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling cancelOrder.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Status>(`${this.configuration.basePath}/order/CancelOrder/${encodeURIComponent(String(tripId))}/${encodeURIComponent(String(orderId))}/${encodeURIComponent(String(cause))}/${encodeURIComponent(String(userName))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param tripId 
     * @param centerFieldId 
     * @param orderModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public checkItemsExistInDateTime(tripId: number, centerFieldId: number, orderModel?: OrderModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<string>;
    public checkItemsExistInDateTime(tripId: number, centerFieldId: number, orderModel?: OrderModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<HttpResponse<string>>;
    public checkItemsExistInDateTime(tripId: number, centerFieldId: number, orderModel?: OrderModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<HttpEvent<string>>;
    public checkItemsExistInDateTime(tripId: number, centerFieldId: number, orderModel?: OrderModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain'}): Observable<any> {
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling checkItemsExistInDateTime.');
        }
        if (centerFieldId === null || centerFieldId === undefined) {
            throw new Error('Required parameter centerFieldId was null or undefined when calling checkItemsExistInDateTime.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<string>(`${this.configuration.basePath}/orderItems/CheckItemsExistInDateTime/${encodeURIComponent(String(tripId))}/${encodeURIComponent(String(centerFieldId))}`,
            orderModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param tripId 
     * @param orderId 
     * @param itemIndex 
     * @param userName 
     * @param permId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteItemOrder(tripId: number, orderId: number, itemIndex: number, userName: string, permId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<OrderItem>>;
    public deleteItemOrder(tripId: number, orderId: number, itemIndex: number, userName: string, permId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<OrderItem>>>;
    public deleteItemOrder(tripId: number, orderId: number, itemIndex: number, userName: string, permId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<OrderItem>>>;
    public deleteItemOrder(tripId: number, orderId: number, itemIndex: number, userName: string, permId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling deleteItemOrder.');
        }
        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling deleteItemOrder.');
        }
        if (itemIndex === null || itemIndex === undefined) {
            throw new Error('Required parameter itemIndex was null or undefined when calling deleteItemOrder.');
        }
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling deleteItemOrder.');
        }
        if (permId === null || permId === undefined) {
            throw new Error('Required parameter permId was null or undefined when calling deleteItemOrder.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.delete<Array<OrderItem>>(`${this.configuration.basePath}/orderItems/DeleteItemOrder/${encodeURIComponent(String(tripId))}/${encodeURIComponent(String(orderId))}/${encodeURIComponent(String(itemIndex))}/${encodeURIComponent(String(userName))}/${encodeURIComponent(String(permId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param tripId 
     * @param userName 
     * @param permId 
     * @param descOccupancyProbFromSp 
     * @param isRemoveOccProb 
     * @param orderModel 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public editOrder(tripId: number, userName: string, permId: number, descOccupancyProbFromSp: string, isRemoveOccProb: number, orderModel?: OrderModel, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<TripModel>;
    public editOrder(tripId: number, userName: string, permId: number, descOccupancyProbFromSp: string, isRemoveOccProb: number, orderModel?: OrderModel, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<TripModel>>;
    public editOrder(tripId: number, userName: string, permId: number, descOccupancyProbFromSp: string, isRemoveOccProb: number, orderModel?: OrderModel, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<TripModel>>;
    public editOrder(tripId: number, userName: string, permId: number, descOccupancyProbFromSp: string, isRemoveOccProb: number, orderModel?: OrderModel, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling editOrder.');
        }
        if (userName === null || userName === undefined) {
            throw new Error('Required parameter userName was null or undefined when calling editOrder.');
        }
        if (permId === null || permId === undefined) {
            throw new Error('Required parameter permId was null or undefined when calling editOrder.');
        }
        if (descOccupancyProbFromSp === null || descOccupancyProbFromSp === undefined) {
            throw new Error('Required parameter descOccupancyProbFromSp was null or undefined when calling editOrder.');
        }
        if (isRemoveOccProb === null || isRemoveOccProb === undefined) {
            throw new Error('Required parameter isRemoveOccProb was null or undefined when calling editOrder.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.put<TripModel>(`${this.configuration.basePath}/Order/EditOrder/${encodeURIComponent(String(tripId))}/${encodeURIComponent(String(userName))}/${encodeURIComponent(String(permId))}/${encodeURIComponent(String(descOccupancyProbFromSp))}/${encodeURIComponent(String(isRemoveOccProb))}`,
            orderModel,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOrderTypes(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<OrderType>>;
    public getOrderTypes(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<OrderType>>>;
    public getOrderTypes(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<OrderType>>>;
    public getOrderTypes(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<OrderType>>(`${this.configuration.basePath}/order/orderType`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param supplierId 
     * @param centerFieldId 
     * @param isOneDay 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOrdersItemBySupplierID(supplierId: number, centerFieldId: number, isOneDay: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<ItemsByTypeOrder>>;
    public getOrdersItemBySupplierID(supplierId: number, centerFieldId: number, isOneDay: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<ItemsByTypeOrder>>>;
    public getOrdersItemBySupplierID(supplierId: number, centerFieldId: number, isOneDay: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<ItemsByTypeOrder>>>;
    public getOrdersItemBySupplierID(supplierId: number, centerFieldId: number, isOneDay: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (supplierId === null || supplierId === undefined) {
            throw new Error('Required parameter supplierId was null or undefined when calling getOrdersItemBySupplierID.');
        }
        if (centerFieldId === null || centerFieldId === undefined) {
            throw new Error('Required parameter centerFieldId was null or undefined when calling getOrdersItemBySupplierID.');
        }
        if (isOneDay === null || isOneDay === undefined) {
            throw new Error('Required parameter isOneDay was null or undefined when calling getOrdersItemBySupplierID.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<ItemsByTypeOrder>>(`${this.configuration.basePath}/orderItems/OrdersItemBySupplierID/${encodeURIComponent(String(supplierId))}/${encodeURIComponent(String(centerFieldId))}/${encodeURIComponent(String(isOneDay))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param orderTypeId 
     * @param centerField 
     * @param permissionUser 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSupplierByOrderType(orderTypeId: number, centerField: number, permissionUser: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Supplier>;
    public getSupplierByOrderType(orderTypeId: number, centerField: number, permissionUser: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Supplier>>;
    public getSupplierByOrderType(orderTypeId: number, centerField: number, permissionUser: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Supplier>>;
    public getSupplierByOrderType(orderTypeId: number, centerField: number, permissionUser: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (orderTypeId === null || orderTypeId === undefined) {
            throw new Error('Required parameter orderTypeId was null or undefined when calling getSupplierByOrderType.');
        }
        if (centerField === null || centerField === undefined) {
            throw new Error('Required parameter centerField was null or undefined when calling getSupplierByOrderType.');
        }
        if (permissionUser === null || permissionUser === undefined) {
            throw new Error('Required parameter permissionUser was null or undefined when calling getSupplierByOrderType.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Supplier>(`${this.configuration.basePath}/supplier/SupplierByOrderType/${encodeURIComponent(String(orderTypeId))}/${encodeURIComponent(String(centerField))}/${encodeURIComponent(String(permissionUser))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param orderTypeId 
     * @param tripId 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSupplierList(orderTypeId: number, tripId: number, orderId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<Supplier>>;
    public getSupplierList(orderTypeId: number, tripId: number, orderId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<Supplier>>>;
    public getSupplierList(orderTypeId: number, tripId: number, orderId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<Supplier>>>;
    public getSupplierList(orderTypeId: number, tripId: number, orderId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (orderTypeId === null || orderTypeId === undefined) {
            throw new Error('Required parameter orderTypeId was null or undefined when calling getSupplierList.');
        }
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling getSupplierList.');
        }
        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling getSupplierList.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<Supplier>>(`${this.configuration.basePath}/supplier/getSupplierList/${encodeURIComponent(String(orderTypeId))}/${encodeURIComponent(String(tripId))}/${encodeURIComponent(String(orderId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param tripId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTempOrders(tripId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<TempOrder>>;
    public getTempOrders(tripId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<TempOrder>>>;
    public getTempOrders(tripId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<TempOrder>>>;
    public getTempOrders(tripId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (tripId === null || tripId === undefined) {
            throw new Error('Required parameter tripId was null or undefined when calling getTempOrders.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<TempOrder>>(`${this.configuration.basePath}/tempOrder/${encodeURIComponent(String(tripId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param orderItemId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public ifAddItemToExistItemByIdOrder(orderItemId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<number>;
    public ifAddItemToExistItemByIdOrder(orderItemId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<HttpResponse<number>>;
    public ifAddItemToExistItemByIdOrder(orderItemId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain'}): Observable<HttpEvent<number>>;
    public ifAddItemToExistItemByIdOrder(orderItemId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain'}): Observable<any> {
        if (orderItemId === null || orderItemId === undefined) {
            throw new Error('Required parameter orderItemId was null or undefined when calling ifAddItemToExistItemByIdOrder.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<number>(`${this.configuration.basePath}/defaultItemByItem/IfAddItemToExistItemByIdOrder/${encodeURIComponent(String(orderItemId))}'`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
