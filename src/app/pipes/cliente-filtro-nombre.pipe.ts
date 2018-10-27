import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clienteFiltroNombre'
})
export class ClienteFiltroNombre implements PipeTransform {

  
  transform(array: any[], query: string): any {
    if (query) {
        return _.filter(array, row => (row.nombreCompleto).toLowerCase().indexOf(query) > -1);
    }
    return array;
  }

}
