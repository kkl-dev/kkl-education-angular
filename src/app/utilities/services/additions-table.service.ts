import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableCellModel } from '../models/TableCell';

@Injectable({
  providedIn: 'root'
})
export class AdditionsTableService {

  public dataSubject = new BehaviorSubject<TableCellModel[][]>([]);
  public data$ = this.dataSubject.asObservable()

  constructor() { }
}
