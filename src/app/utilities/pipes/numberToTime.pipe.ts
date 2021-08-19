import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'numberToTimePipe'})
export class NumberToTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes=value%1 ===0?':00':`:${value%1 *60}`
    return `${Math.floor(value)}${minutes}`
  }
}