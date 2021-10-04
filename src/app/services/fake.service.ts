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

  // getForestCenter() {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');
  //   return this.http.get(`${this.url}forestCenters`, { headers });
  // }

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

  getLodgingFacilityList(name: string) {
    const list: any = {
      "facilityList": [
        {
          "fieldForestCenterName": "מרכז שדה לביא",
          "lodgingFacilityList": [
            {
              "structureId": 849,
              "gender": "בנים",
              "status": "פנוי"
            },
            {
              "structureId": 850,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 851,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 852,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 853,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 1195,
              "gender": "בנות",
              "status": "פנוי"
            },
            {
              "structureId": 1196,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 1197,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 1198,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "מרכז שדה ציפורי",
          "lodgingFacilityList": [
            {
              "structureId": 683,
              "gender": "בנים",
              "status": "פנוי"
            },
            {
              "structureId": 684,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 685,
              "gender": "בנות",
              "status": "פנוי"
            },
            {
              "structureId": 686,
              "gender": "בנים",
              "status": "פנוי"
            },
            {
              "structureId": 687,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 688,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 689,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 690,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "מרכז שדה נס הרים",
          "lodgingFacilityList": [
            {
              "structureId": 37,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 149,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 150,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 151,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 152,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 153,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 154,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 155,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 156,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 157,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "מצפה בית אשל",
          "lodgingFacilityList": [
            {
              "structureId": 428,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 430,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 1236,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "מרכז שדה יתיר",
          "lodgingFacilityList": [
            {
              "structureId": 116,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 117,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 118,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 119,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 120,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 121,
              "gender": "בנות",
              "status": "תפוס"
            },
            {
              "structureId": 122,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 123,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "מרכז שדה שוני",
          "lodgingFacilityList": [
            {
              "structureId": 849,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 1199,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 1195,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        },
        {
          "fieldForestCenterName": "אילנות מערב",
          "lodgingFacilityList": [
            {
              "structureId": 605,
              "gender": "בנים",
              "status": "תפוס"
            },
            {
              "structureId": 791,
              "gender": "מעורב",
              "status": "פנוי"
            },
            {
              "structureId": 792,
              "gender": "בנות",
              "status": "תפוס"
            }
          ]
        }
      ]
    }

    let result: any = '';

    let nameF: string;
    if (name == 'נס הרים')
      nameF = 'מרכז שדה נס הרים';
    else if (name == 'ציפורי')
      nameF = 'מרכז שדה ציפורי';
    else if (name == 'אילנות')
      nameF = 'אילנות מערב';
    else if (name == 'בית אשל')
      nameF = 'מצפה בית אשל';
    else if (name == 'יתיר')
      nameF = 'מרכז שדה יתיר';
    else if (name == 'לביא')
      nameF = 'מרכז שדה לביא';
    else if (name == 'שוני')
      nameF = 'מרכז שדה שוני';

    if (nameF != '')
      result = list.facilityList.filter(n => n.fieldForestCenterName == nameF)[0];
    else
      result = {};

    return result;
  }
}
