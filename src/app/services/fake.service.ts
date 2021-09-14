import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getForestCenter() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.url}forestCenters`, { headers });
  }

  getAvailableFacilityDates(day: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.url}AvailableFacilityDates`, { headers });
  }

  getAvailableSleepingOptionsByDay(dates: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.url}AvailableSleepingOptionsByDay`, { headers });
  }

  // getAll(): Observable<any> {
  //   return this.http.get(this.url + '?_sort=id&_order=desc')
  //     .map((response: { json: () => any; }) => response.json());
  // }
}
