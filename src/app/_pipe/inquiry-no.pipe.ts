import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inquiryNo'
})
export class InquiryNoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value <= 9) { return '000' + value;
    } else if ( value <= 99) { return '00' + value;
    } else if (value <= 999 ) { return '0' + value;
    } else { return value; }
  }

}
