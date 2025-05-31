import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
})
export class DatepickerFormatPipe implements PipeTransform {
  transform(value: any, format: string = 'yyyy-MM-dd'): any {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, format);
  }
}
