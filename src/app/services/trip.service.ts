import { Injectable } from '@angular/core';
import { FieldForestCenter } from '../api';

@Injectable({
  providedIn: 'root'
})
export class TripService {
 centerField: FieldForestCenter | undefined;
  dateObj: any;
  constructor() { }
}
